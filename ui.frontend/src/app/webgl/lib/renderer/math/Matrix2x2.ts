import Vector2 from './Vector2';

export default class Matrix2x2 {
  public m: number[] = new Array(4);

  constructor(...v: number[]) {
    if (v.length === 4) {
      this.m = [...v];
    } else {
      Matrix2x2.identity(this);
    }
  }

  public clone() {
    return Matrix2x2.clone(this);
  }

  public static clone(a: Matrix2x2) {
    return new Matrix2x2(...a.m);
  }

  public static copy(outm: Matrix2x2, am: Matrix2x2) {
    outm.m = [...am.m];
    return outm;
  }

  public static identity(outm: Matrix2x2) {
    const out = outm.m;
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }

  public static fromValues(m00: number, m01: number, m10: number, m11: number) {
    return new Matrix2x2(m00, m01, m10, m11);
  }

  public static setValues(outm: Matrix2x2, m00: number, m01: number, m10: number, m11: number) {
    const out = outm.m;
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
  }

  public static transpose(outm: Matrix2x2, am: Matrix2x2) {
    const out = outm.m,
      a = am.m;
    // If we are transposing ourselves we can skip a few steps but have to cache
    // some values
    if (out === a) {
      let a1 = a[1];
      out[1] = a[2];
      out[2] = a1;
    } else {
      out[0] = a[0];
      out[1] = a[2];
      out[2] = a[1];
      out[3] = a[3];
    }

    return out;
  }

  public static invert(outm: Matrix2x2, am: Matrix2x2) {
    const out = outm.m,
      a = am.m;
    const a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];

    // Calculate the determinant
    let det = a0 * a3 - a2 * a1;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out[0] = a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] = a0 * det;

    return out;
  }

  public static adjoint(outm: Matrix2x2, am: Matrix2x2) {
    const out = outm.m,
      a = am.m;
    const a0 = a[0];
    out[0] = a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a0;

    return out;
  }

  public static determinant(am: Matrix2x2) {
    const a = am.m;
    return a[0] * a[3] - a[2] * a[1];
  }

  public static multiply(outm: Matrix2x2, am: Matrix2x2, bm: Matrix2x2) {
    const out = outm.m,
      a = am.m,
      b = bm.m;
    const a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
    const b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
  }

  public static rotate(outm: Matrix2x2, am: Matrix2x2, rad: number) {
    const out = outm.m,
      a = am.m;
    const a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = a0 * c + a2 * s;
    out[1] = a1 * c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
  }

  public static scale(outm: Matrix2x2, am: Matrix2x2, v: Vector2) {
    const out = outm.m,
      a = am.m;
    const a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
    const v0 = v.x,
      v1 = v.y;
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
  }

  public static fromRotation(outm: Matrix2x2, rad: number) {
    const out = outm.m;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    return out;
  }

  public static fromScaling(outm: Matrix2x2, v: Vector2) {
    const out = outm.m;
    out[0] = v.x;
    out[1] = 0;
    out[2] = 0;
    out[3] = v.y;
    return out;
  }
}
