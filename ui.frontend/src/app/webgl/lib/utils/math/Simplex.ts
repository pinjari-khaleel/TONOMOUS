import Vector3 from '../../renderer/math/Vector3';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Matrix2x2 from 'mediamonks-webgl/renderer/math/Matrix2x2';

/*
 * A fast javascript implementation of simplex noise by Jonas Wagner
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 *
 *
 * Copyright (C) 2016 Jonas Wagner
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

export default class Simplex {
  private static isPrepared: boolean = false;
  private static permMod12: Uint8Array;
  private static p: Uint8Array;
  private static perm: Uint8Array;

  private static F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  private static G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  private static F3 = 1.0 / 3.0;
  private static G3 = 1.0 / 6.0;
  private static F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
  private static G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

  private static grad3: Float32Array = new Float32Array([
    1,
    1,
    0,
    -1,
    1,
    0,
    1,
    -1,
    0,

    -1,
    -1,
    0,
    1,
    0,
    1,
    -1,
    0,
    1,

    1,
    0,
    -1,
    -1,
    0,
    -1,
    0,
    1,
    1,

    0,
    -1,
    1,
    0,
    1,
    -1,
    0,
    -1,
    -1,
  ]);

  private static grad4: Float32Array = new Float32Array([
    0,
    1,
    1,
    1,
    0,
    1,
    1,
    -1,
    0,
    1,
    -1,
    1,
    0,
    1,
    -1,
    -1,
    0,
    -1,
    1,
    1,
    0,
    -1,
    1,
    -1,
    0,
    -1,
    -1,
    1,
    0,
    -1,
    -1,
    -1,
    1,
    0,
    1,
    1,
    1,
    0,
    1,
    -1,
    1,
    0,
    -1,
    1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    1,
    -1,
    0,
    1,
    -1,
    -1,
    0,
    -1,
    1,
    -1,
    0,
    -1,
    -1,
    1,
    1,
    0,
    1,
    1,
    1,
    0,
    -1,
    1,
    -1,
    0,
    1,
    1,
    -1,
    0,
    -1,
    -1,
    1,
    0,
    1,
    -1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    -1,
    -1,
    0,
    -1,
    1,
    1,
    1,
    0,
    1,
    1,
    -1,
    0,
    1,
    -1,
    1,
    0,
    1,
    -1,
    -1,
    0,
    -1,
    1,
    1,
    0,
    -1,
    1,
    -1,
    0,
    -1,
    -1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
  ]);

  public static prepare() {
    if (!Simplex.isPrepared) {
      Simplex.p = Simplex.buildPermutationTable();
      Simplex.perm = new Uint8Array(512);
      Simplex.permMod12 = new Uint8Array(512);
      for (let i = 0; i < 512; i++) {
        Simplex.perm[i] = Simplex.p[i & 255];
        Simplex.permMod12[i] = Simplex.perm[i] % 12;
      }
      Simplex.isPrepared = true;
    }
  }

  public static noise2D(xin: number, yin: number): number {
    Simplex.prepare();

    let permMod12 = Simplex.permMod12;
    let perm = Simplex.perm;
    let grad3 = Simplex.grad3;
    let n0 = 0; // Noise contributions from the three corners
    let n1 = 0;
    let n2 = 0;
    // Skew the input space to determine which simplex cell we're in
    let s = (xin + yin) * Simplex.F2; // Hairy factor for 2D
    let i = Math.floor(xin + s);
    let j = Math.floor(yin + s);
    let t = (i + j) * Simplex.G2;
    let X0 = i - t; // Unskew the cell origin back to (x,y) space
    let Y0 = j - t;
    let x0 = xin - X0; // The x,y distances from the cell origin
    let y0 = yin - Y0;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    else {
      i1 = 0;
      j1 = 1;
    } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    let x1 = x0 - i1 + Simplex.G2; // Offsets for middle corner in (x,y) unskewed coords
    let y1 = y0 - j1 + Simplex.G2;
    let x2 = x0 - 1.0 + 2.0 * Simplex.G2; // Offsets for last corner in (x,y) unskewed coords
    let y2 = y0 - 1.0 + 2.0 * Simplex.G2;
    // Work out the hashed gradient indices of the three simplex corners
    let ii = i & 255;
    let jj = j & 255;
    // Calculate the contribution from the three corners
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      let gi0 = permMod12[ii + perm[jj]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      let gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      let gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70.0 * (n0 + n1 + n2);
  }

  // 3D simplex noise
  public static noise3D(xin: number, yin: number, zin: number): number {
    Simplex.prepare();

    let permMod12 = Simplex.permMod12;
    let perm = Simplex.perm;
    let grad3 = Simplex.grad3;
    let n0, n1, n2, n3; // Noise contributions from the four corners
    // Skew the input space to determine which simplex cell we're in
    let s = (xin + yin + zin) * Simplex.F3; // Very nice and simple skew factor for 3D
    let i = Math.floor(xin + s);
    let j = Math.floor(yin + s);
    let k = Math.floor(zin + s);
    let t = (i + j + k) * Simplex.G3;
    let X0 = i - t; // Unskew the cell origin back to (x,y,z) space
    let Y0 = j - t;
    let Z0 = k - t;
    let x0 = xin - X0; // The x,y,z distances from the cell origin
    let y0 = yin - Y0;
    let z0 = zin - Z0;
    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } // X Y Z order
      else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } // X Z Y order
      else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } // Z X Y order
    } else {
      // x0<y0
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } // Z Y X order
      else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } // Y Z X order
      else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } // Y X Z order
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    let x1 = x0 - i1 + Simplex.G3; // Offsets for second corner in (x,y,z) coords
    let y1 = y0 - j1 + Simplex.G3;
    let z1 = z0 - k1 + Simplex.G3;
    let x2 = x0 - i2 + 2.0 * Simplex.G3; // Offsets for third corner in (x,y,z) coords
    let y2 = y0 - j2 + 2.0 * Simplex.G3;
    let z2 = z0 - k2 + 2.0 * Simplex.G3;
    let x3 = x0 - 1.0 + 3.0 * Simplex.G3; // Offsets for last corner in (x,y,z) coords
    let y3 = y0 - 1.0 + 3.0 * Simplex.G3;
    let z3 = z0 - 1.0 + 3.0 * Simplex.G3;
    // Work out the hashed gradient indices of the four simplex corners
    let ii = i & 255;
    let jj = j & 255;
    let kk = k & 255;
    // Calculate the contribution from the four corners
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) {
      n0 = 0.0;
    } else {
      let gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) {
      n1 = 0.0;
    } else {
      let gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) {
      n2 = 0.0;
    } else {
      let gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) {
      n3 = 0.0;
    } else {
      let gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      t3 *= t3;
      n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]
    return 32.0 * (n0 + n1 + n2 + n3);
  }

  // 4D simplex noise, better simplex rank ordering method 2012-03-09
  public static noise4D(x: number, y: number, z: number, w: number): number {
    Simplex.prepare();

    // let permMod12 = Simplex.permMod12;
    let perm = Simplex.perm;
    let grad4 = Simplex.grad4;

    let n0, n1, n2, n3, n4; // Noise contributions from the five corners
    // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
    let s = (x + y + z + w) * Simplex.F4; // Factor for 4D skewing
    let i = Math.floor(x + s);
    let j = Math.floor(y + s);
    let k = Math.floor(z + s);
    let l = Math.floor(w + s);
    let t = (i + j + k + l) * Simplex.G4; // Factor for 4D unskewing
    let X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
    let Y0 = j - t;
    let Z0 = k - t;
    let W0 = l - t;
    let x0 = x - X0; // The x,y,z,w distances from the cell origin
    let y0 = y - Y0;
    let z0 = z - Z0;
    let w0 = w - W0;
    // For the 4D case, the simplex is a 4D shape I won't even try to describe.
    // To find out which of the 24 possible simplices we're in, we need to
    // determine the magnitude ordering of x0, y0, z0 and w0.
    // Six pair-wise comparisons are performed between each possible pair
    // of the four coordinates, and the results are used to rank the numbers.
    let rankx = 0;
    let ranky = 0;
    let rankz = 0;
    let rankw = 0;
    if (x0 > y0) {
      rankx++;
    } else {
      ranky++;
    }
    if (x0 > z0) {
      rankx++;
    } else {
      rankz++;
    }
    if (x0 > w0) {
      rankx++;
    } else {
      rankw++;
    }
    if (y0 > z0) {
      ranky++;
    } else {
      rankz++;
    }
    if (y0 > w0) {
      ranky++;
    } else {
      rankw++;
    }
    if (z0 > w0) {
      rankz++;
    } else {
      rankw++;
    }
    let i1, j1, k1, l1; // The integer offsets for the second simplex corner
    let i2, j2, k2, l2; // The integer offsets for the third simplex corner
    let i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
    // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
    // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
    // impossible. Only the 24 indices which have non-zero entries make any sense.
    // We use a thresholding to set the coordinates in turn from the largest magnitude.
    // Rank 3 denotes the largest coordinate.
    i1 = rankx >= 3 ? 1 : 0;
    j1 = ranky >= 3 ? 1 : 0;
    k1 = rankz >= 3 ? 1 : 0;
    l1 = rankw >= 3 ? 1 : 0;
    // Rank 2 denotes the second largest coordinate.
    i2 = rankx >= 2 ? 1 : 0;
    j2 = ranky >= 2 ? 1 : 0;
    k2 = rankz >= 2 ? 1 : 0;
    l2 = rankw >= 2 ? 1 : 0;
    // Rank 1 denotes the second smallest coordinate.
    i3 = rankx >= 1 ? 1 : 0;
    j3 = ranky >= 1 ? 1 : 0;
    k3 = rankz >= 1 ? 1 : 0;
    l3 = rankw >= 1 ? 1 : 0;
    // The fifth corner has all coordinate offsets = 1, so no need to compute that.
    let x1 = x0 - i1 + Simplex.G4; // Offsets for second corner in (x,y,z,w) coords
    let y1 = y0 - j1 + Simplex.G4;
    let z1 = z0 - k1 + Simplex.G4;
    let w1 = w0 - l1 + Simplex.G4;
    let x2 = x0 - i2 + 2.0 * Simplex.G4; // Offsets for third corner in (x,y,z,w) coords
    let y2 = y0 - j2 + 2.0 * Simplex.G4;
    let z2 = z0 - k2 + 2.0 * Simplex.G4;
    let w2 = w0 - l2 + 2.0 * Simplex.G4;
    let x3 = x0 - i3 + 3.0 * Simplex.G4; // Offsets for fourth corner in (x,y,z,w) coords
    let y3 = y0 - j3 + 3.0 * Simplex.G4;
    let z3 = z0 - k3 + 3.0 * Simplex.G4;
    let w3 = w0 - l3 + 3.0 * Simplex.G4;
    let x4 = x0 - 1.0 + 4.0 * Simplex.G4; // Offsets for last corner in (x,y,z,w) coords
    let y4 = y0 - 1.0 + 4.0 * Simplex.G4;
    let z4 = z0 - 1.0 + 4.0 * Simplex.G4;
    let w4 = w0 - 1.0 + 4.0 * Simplex.G4;
    // Work out the hashed gradient indices of the five simplex corners
    let ii = i & 255;
    let jj = j & 255;
    let kk = k & 255;
    let ll = l & 255;
    // Calculate the contribution from the five corners
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
    if (t0 < 0) {
      n0 = 0.0;
    } else {
      let gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
      t0 *= t0;
      n0 =
        t0 *
        t0 *
        (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
    if (t1 < 0) {
      n1 = 0.0;
    } else {
      let gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
      t1 *= t1;
      n1 =
        t1 *
        t1 *
        (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
    if (t2 < 0) {
      n2 = 0.0;
    } else {
      let gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
      t2 *= t2;
      n2 =
        t2 *
        t2 *
        (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
    if (t3 < 0) {
      n3 = 0.0;
    } else {
      let gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
      t3 *= t3;
      n3 =
        t3 *
        t3 *
        (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
    }
    let t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
    if (t4 < 0) {
      n4 = 0.0;
    } else {
      let gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
      t4 *= t4;
      n4 =
        t4 *
        t4 *
        (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
    }
    // Sum up and scale the result to cover the range [-1,1]
    return 27.0 * (n0 + n1 + n2 + n3 + n4);
  }

  public static curlNoise4D(out: Vector3, x: number, y: number, z: number, w: number): Vector3 {
    let eps = 0.01;
    let x0 = Simplex.noise4D(x + eps, y, z, w);
    let x1 = Simplex.noise4D(x - eps, y, z, w);
    let y0 = Simplex.noise4D(x, y - eps, z, w);
    let y1 = Simplex.noise4D(x, y + eps, z, w);
    let z0 = Simplex.noise4D(x, y, z - eps, w);
    let z1 = Simplex.noise4D(x, y, z + eps, w);

    let dx = x0 - x1;
    let dy = y0 - y1;
    let dz = z0 - z1;

    out.x = dy - dz;
    out.y = dz - dx;
    out.z = dx - dy;

    out.multiplyScalar(1 / (2 * eps));
    return out;
  }

  private static buildPermutationTable(): Uint8Array {
    let i;
    let p = new Uint8Array(256);
    for (i = 0; i < 256; i++) {
      p[i] = i;
    }
    for (i = 0; i < 255; i++) {
      let r = i + ~~(Math.random() * (256 - i));
      let aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    return p;
  }

  //octaves can be float
  public static octaves2D(
    x: number,
    y: number,
    octaves: number = 6,
    falloff: number = 0.612,
  ): number {
    let m: Matrix2x2 = new Matrix2x2(1.6, 1.2, -1.2, 1.6);
    let q: Vector2 = new Vector2(x, y);
    let a = 1;
    let sum = 0;

    let lastOctaveWeight = octaves % 1;
    for (let i = 0; i < Math.ceil(octaves); i++) {
      //let weight = Math.min(i+1, octaves) % 1;
      if (i + 1 > octaves) a *= lastOctaveWeight;
      sum += Simplex.noise2D(q.x, q.y) * a;
      q = Vector2.transformMat2(q, m);
      a *= falloff;
    }
    return 0.5 * sum + 0.5;
  }
}
