import Vector3 from '../../renderer/math/Vector3';
import Matrix3x3 from 'mediamonks-webgl/renderer/math/Matrix3x3';

export default class Noise {
  private static _tempV30: Vector3 = new Vector3();
  private static _tempV31: Vector3 = new Vector3();
  private static _tempV32: Vector3 = new Vector3();
  private static _tempV33: Vector3 = new Vector3();
  private static _tempV34: Vector3 = new Vector3();
  private static _tempV35: Vector3 = new Vector3();

  private static _hashDot = new Vector3(12.9898, 39.1215, 78.233);
  private static _hashDotX = new Vector3(12.9898, 39.1215, 78.233);
  private static _hashDotY = new Vector3(36.8704, 19.6392, 83.123);
  private static _hashDotZ = new Vector3(58.927, 17.456, 38.347);

  private static _noiseSeed: number = 43758.5453;
  private static _noiseSeedX: number = 43758.5453;
  private static _noiseSeedY: number = 87345.5453;
  private static _noiseSeedZ: number = 19045.5453;

  private static p100 = new Vector3(1, 0, 0);
  private static p010 = new Vector3(0, 1, 0);
  private static p110 = new Vector3(1, 1, 0);
  private static p001 = new Vector3(0, 0, 1);
  private static p101 = new Vector3(1, 0, 1);
  private static p011 = new Vector3(0, 1, 1);
  private static p111 = new Vector3(1, 1, 1);

  private static _tempV3 = new Vector3();

  //TODO: save to a texture and have it part of the library

  public static sineNoise1(t: number, fallOff: number = 0.618, octaves: number = 8): number {
    let out: number = 0;
    let a: number = 1;
    let f: number = 1;
    for (let i: number = 0; i < octaves; i++) {
      out += Math.sin(t * f) * a;
      f /= fallOff;
      a *= fallOff;
    }
    return out;
  }

  public static sineNoise3(t: number, fallOff: number = 0.618, octaves: number = 8): Vector3 {
    const out = new Vector3();
    out.x = Noise.sineNoise1(t, fallOff, octaves);
    out.y = Noise.sineNoise1(t * 0.98765 + 10000, fallOff, octaves);
    out.z = Noise.sineNoise1(t * 1.23456 + 20000, fallOff, octaves);
    return out;
  }

  private static _rotationMatrix = Matrix3x3.fromValues(
    0.0,
    0.8,
    0.6,
    -0.8,
    0.36,
    -0.48,
    -0.6,
    -0.48,
    0.64,
  );

  public static sineNoise33(p: Vector3, fallOff: number = 0.618, octaves: number = 6): Vector3 {
    const out = new Vector3();
    let a: number = 1;
    let f: number = 1;
    for (let i: number = 0; i < octaves; i++) {
      out.x += Math.sin(p.y * f) * a;
      out.y += Math.sin(p.z * f) * a;
      out.z += Math.sin(p.x * f) * a;
      p = Vector3.transformMat3(p, Noise._rotationMatrix);
      f /= fallOff;
      a *= fallOff;
    }
    return out;
  }

  public static getFloatNoiseVolumeData(dim: number, frequency: number): Float32Array {
    var invDim: number = 1 / dim;
    var i: number = 0;
    var data: Float32Array = new Float32Array(dim * dim * dim * 4);
    var p: Vector3 = new Vector3();

    Noise.RandomizeSeeds();

    for (var z: number = 0; z < dim; z++) {
      p.z = z * invDim * frequency;
      for (var y: number = 0; y < dim; y++) {
        p.y = y * invDim * frequency;
        for (var x: number = 0; x < dim; x++) {
          p.x = x * invDim * frequency;

          //var noise3:Vector3 = Vector3.noise(p);
          var noise3: Vector3 = Noise.noise3(p);

          data[i++] = noise3.x;
          data[i++] = noise3.y;
          data[i++] = noise3.z;
          data[i++] = 0;
        }
      }
    }
    return data;
  }

  //TODO: make tileable
  //uses a layout which is suitable for a 2d texture
  public static getFloatNoiseVolumeDataAs2D(
    width: number,
    height: number,
    dim: number,
    frequency: number,
  ): Float32Array {
    var invDim: number = 1 / dim;
    var i: number = 0;
    var data: Float32Array = new Float32Array(dim * dim * dim * 4);
    var p: Vector3 = new Vector3();

    Noise.RandomizeSeeds();
    var rowLength: number = width / dim;
    var noise: Vector3 = new Vector3();
    var octave: Vector3;
    var octaves: number = 8;
    var amp: number = 1;

    var offsets: Vector3[] = [];
    for (var oct: number = 0; oct < octaves; oct++) {
      offsets.push(new Vector3().randomize());
    }
    //var f:number = 1;

    for (var y: number = 0; y < height; y++) {
      for (var x: number = 0; x < width; x++) {
        p.x = x % dim;
        p.y = y % dim;
        p.z = Math.floor(y * invDim) * rowLength + Math.floor(x * invDim);
        //var noise3:Vector3 = Vector3.noise(p);
        p.multiplyScalar(invDim * frequency);
        noise.setValues(0, 0, 0);

        amp = 1;
        for (var oct: number = 0; oct < octaves; oct++) {
          p.add(offsets[oct]);
          octave = Noise.noise3(p);
          octave.multiplyScalar(amp);
          noise.add(octave);
          amp *= 0.5678;
          p.multiplyScalar(1.8);
          //f *= 1.8;
        }

        //data[i++ ] = p.x * invDim;
        //data[i++ ] = p.y * invDim;
        //data[i++ ] = p.z * invDim;

        data[i++] = noise.x;
        data[i++] = noise.y;
        data[i++] = noise.z;
        data[i++] = 0;
      }
    }

    return data;
  }

  public static getUintNoiseVolumeData(dim: number, frequency: number): Uint8Array {
    var dataF: Float32Array = Noise.getFloatNoiseVolumeData(dim, frequency);
    var l: number = dataF.length;
    var data: Uint8Array = new Uint8Array(l);

    for (var i: number = 0; i < l; i++) {
      var f = (dataF[i] * 0.5 + 0.5) * 255;
      data[i] = Math.floor(f);
    }
    return data;
  }

  public static getUintNoiseVolumeDataAs2D(
    width: number,
    height: number,
    dim: number,
    frequency: number,
  ): Uint8Array {
    var dataF: Float32Array = Noise.getFloatNoiseVolumeDataAs2D(width, height, dim, frequency);
    var l: number = dataF.length;
    var data: Uint8Array = new Uint8Array(l);

    for (var i: number = 0; i < l; i++) {
      var f = (dataF[i] * 0.5 + 0.5) * 255;
      data[i] = Math.floor(f);
      //data[i] = i % 255;
    }
    return data;
  }

  public static RandomizeSeeds(): void {
    Noise._hashDotX.randomize01();
    Noise._hashDotX.multiplyScalar(100);

    Noise._hashDotY.randomize01();
    Noise._hashDotY.multiplyScalar(100);

    Noise._hashDotZ.randomize01();
    Noise._hashDotZ.multiplyScalar(100);

    Noise._noiseSeedX = Math.random() * 10000;
    Noise._noiseSeedY = Math.random() * 10000;
    Noise._noiseSeedZ = Math.random() * 10000;
  }

  public static getUint8Data(): Uint8Array | null {
    return null;
  }

  private static lerp1(a: number, b: number, i: number): number {
    return (1 - i) * a + i * b;
  }

  private static smoothstep1(x: number) {
    return x * x * (3.0 - 2.0 * x);
  }

  private static fract1(x: number): number {
    return x - Math.floor(x);
  }

  public static hash(p: Vector3): number {
    return Noise.fract1(Math.sin(Vector3.dot(p, Noise._hashDot)) * Noise._noiseSeed);
  }

  public static noise1(p: Vector3): number {
    const i = Vector3.floor(p);
    const f = Vector3.fract(p);
    f.smoothstep();

    let x0y0: number = Noise.lerp1(this.hash(i), this.hash(Vector3.add(i, this.p100)), f.x);
    let x1y0: number = Noise.lerp1(
      this.hash(Vector3.add(i, this.p010)),
      this.hash(Vector3.add(i, this.p110)),
      f.x,
    );
    let y0: number = Noise.lerp1(x0y0, x1y0, f.y);

    let x0y1: number = Noise.lerp1(
      this.hash(Vector3.add(i, this.p001)),
      this.hash(Vector3.add(i, this.p101)),
      f.x,
    );
    let x1y1: number = Noise.lerp1(
      this.hash(Vector3.add(i, this.p011)),
      this.hash(Vector3.add(i, this.p111)),
      f.x,
    );
    let y1: number = Noise.lerp1(x0y1, x1y1, f.y);

    return Noise.lerp1(y0, y1, f.z) - 0.5;
  }

  public static mat3 = Matrix3x3.fromValues(0.0, 0.8, 0.6, -0.8, 0.36, -0.48, -0.6, -0.48, 0.64);

  public static perlin1(p: Vector3): number {
    let q = this._tempV35;

    q.copy(p);
    let f = 0.5 * Noise.noise1(q);
    q = Vector3.transformMat3(q, Noise.mat3);
    q.multiplyScalar(2.01);
    f += 0.25 * Noise.noise1(q);
    q = Vector3.transformMat3(q, Noise.mat3);
    q.multiplyScalar(2.02);
    f += 0.125 * Noise.noise1(q);
    q = Vector3.transformMat3(q, Noise.mat3);
    q.multiplyScalar(2.03);
    f += 0.0625 * Noise.noise1(q);
    q = Vector3.transformMat3(q, Noise.mat3);
    q.multiplyScalar(2.04);

    // console.log(p.v, f);

    return f;
  }

  public static perlin3D(x: number, y: number, z: number): number {
    let fade = function (t: number): number {
      return t * t * t * (t * (t * 6 - 15) + 10);
    };
    let lerp = function (t: number, a: number, b: number): number {
      return a + t * (b - a);
    };
    let grad = function (hash: number, x: number, y: number, z: number): number {
      let h: number = hash & 15;
      let u: number = h < 8 ? x : y;
      let v: number = h < 4 ? y : h == 12 || h == 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };
    let scale = function (n: number): number {
      return (1 + n) / 2;
    };

    let p = new Array(512);
    let permutation: number[] = [
      151,
      160,
      137,
      91,
      90,
      15,
      131,
      13,
      201,
      95,
      96,
      53,
      194,
      233,
      7,
      225,
      140,
      36,
      103,
      30,
      69,
      142,
      8,
      99,
      37,
      240,
      21,
      10,
      23,
      190,
      6,
      148,
      247,
      120,
      234,
      75,
      0,
      26,
      197,
      62,
      94,
      252,
      219,
      203,
      117,
      35,
      11,
      32,
      57,
      177,
      33,
      88,
      237,
      149,
      56,
      87,
      174,
      20,
      125,
      136,
      171,
      168,
      68,
      175,
      74,
      165,
      71,
      134,
      139,
      48,
      27,
      166,
      77,
      146,
      158,
      231,
      83,
      111,
      229,
      122,
      60,
      211,
      133,
      230,
      220,
      105,
      92,
      41,
      55,
      46,
      245,
      40,
      244,
      102,
      143,
      54,
      65,
      25,
      63,
      161,
      1,
      216,
      80,
      73,
      209,
      76,
      132,
      187,
      208,
      89,
      18,
      169,
      200,
      196,
      135,
      130,
      116,
      188,
      159,
      86,
      164,
      100,
      109,
      198,
      173,
      186,
      3,
      64,
      52,
      217,
      226,
      250,
      124,
      123,
      5,
      202,
      38,
      147,
      118,
      126,
      255,
      82,
      85,
      212,
      207,
      206,
      59,
      227,
      47,
      16,
      58,
      17,
      182,
      189,
      28,
      42,
      223,
      183,
      170,
      213,
      119,
      248,
      152,
      2,
      44,
      154,
      163,
      70,
      221,
      153,
      101,
      155,
      167,
      43,
      172,
      9,
      129,
      22,
      39,
      253,
      19,
      98,
      108,
      110,
      79,
      113,
      224,
      232,
      178,
      185,
      112,
      104,
      218,
      246,
      97,
      228,
      251,
      34,
      242,
      193,
      238,
      210,
      144,
      12,
      191,
      179,
      162,
      241,
      81,
      51,
      145,
      235,
      249,
      14,
      239,
      107,
      49,
      192,
      214,
      31,
      181,
      199,
      106,
      157,
      184,
      84,
      204,
      176,
      115,
      121,
      50,
      45,
      127,
      4,
      150,
      254,
      138,
      236,
      205,
      93,
      222,
      114,
      67,
      29,
      24,
      72,
      243,
      141,
      128,
      195,
      78,
      66,
      215,
      61,
      156,
      180,
    ];
    for (let i: number = 0; i < 256; i++) {
      p[256 + i] = p[i] = permutation[i];
    }

    let X: number = Math.floor(x) & 255;
    let Y: number = Math.floor(y) & 255;
    let Z: number = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    let u: number = fade(x);
    let v: number = fade(y);
    let w: number = fade(z);
    let A = p[X] + Y,
      AA = p[A] + Z,
      AB = p[A + 1] + Z,
      B = p[X + 1] + Y,
      BA = p[B] + Z,
      BB = p[B + 1] + Z;

    return scale(
      lerp(
        w,
        lerp(
          v,
          lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
          lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z)),
        ),
        lerp(
          v,
          lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
          lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1)),
        ),
      ),
    );
  }

  public static noise3Ref(p: Vector3, o: Vector3): void {
    Noise._noiseSeed = Noise._noiseSeedX;
    Noise._hashDot.copy(Noise._hashDotX);
    o.x = Noise.noise1(p);

    Noise._noiseSeed = Noise._noiseSeedY;
    Noise._hashDot.copy(Noise._hashDotY);
    o.y = Noise.noise1(p);

    Noise._noiseSeed = Noise._noiseSeedZ;
    Noise._hashDot.copy(Noise._hashDotZ);
    o.z = Noise.noise1(p);
  }

  public static noise3(p: Vector3): Vector3 {
    let o: Vector3 = new Vector3();
    this.noise3Ref(p, o);
    return o;
  }

  public static curlNoise3(out: Vector3, center: Vector3): Vector3 {
    let eps = 0.01;
    let p = Noise._tempV34;

    p.copy(center);
    p.x += eps;
    let x0 = this.perlin1(p);

    p.copy(center);
    p.x -= eps;
    let x1 = this.perlin1(p);

    p.copy(center);
    p.y += eps;
    let y0 = this.perlin1(p);

    p.copy(center);
    p.y -= eps;
    let y1 = this.perlin1(p);

    p.copy(center);
    p.z += eps;
    let z0 = this.perlin1(p);

    p.copy(center);
    p.z -= eps;
    let z1 = this.perlin1(p);

    let dx = x0 - x1;
    let dy = y0 - y1;
    let dz = z0 - z1;

    out.x = dy - dz;
    out.y = dz - dx;
    out.z = dx - dy;

    out.multiplyScalar(1 / (2 * eps));

    return out;
  }
}
