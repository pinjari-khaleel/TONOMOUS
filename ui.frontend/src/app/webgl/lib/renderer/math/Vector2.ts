import Matrix2x2 from 'mediamonks-webgl/renderer/math/Matrix2x2';

export default class Vector2 {
  public x: number;
  public y: number;

  public static get ZERO(): Vector2 {
    return new Vector2(0, 0);
  }
  public static get ONE(): Vector2 {
    return new Vector2(1, 1);
  }

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /* CLONE, COPY, SET */

  public clone() {
    return new Vector2(this.x, this.y);
  }

  public copy(v: Vector2): Vector2 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  public setValues(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  /* RETURNS PRIMITIVE TYPE */

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public toString(): string {
    return this.x + ',' + this.y;
  }

  public equals(b: Vector2): boolean {
    return b.x === this.x && b.y === this.y;
  }

  /* MODIFIES IN-PLACE */

  public normalize(): Vector2 {
    let l = this.x * this.x + this.y * this.y;
    if (l > 0) {
      l = 1 / Math.sqrt(l);
    }
    this.x *= l;
    this.y *= l;
    return this;
  }

  public negate(): Vector2 {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  public multiplyScalar(v: number): Vector2 {
    this.x *= v;
    this.y *= v;
    return this;
  }

  public addScalar(v: number): Vector2 {
    this.x += v;
    this.y += v;
    return this;
  }

  public multiplyMatrix(matrix: Matrix2x2): Vector2 {
    const m = matrix.m;
    const x = m[0] * this.x + m[2] * this.y;
    const y = m[1] * this.x + m[3] * this.y;

    return this.setValues(x, y);
  }

  public multiply(v: Vector2): Vector2 {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  public add(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  public subtract(v: Vector2): Vector2 {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  public subtractScalar(v: number): Vector2 {
    this.x -= v;
    this.y -= v;
    return this;
  }

  public rotate(origin: Vector2, angle: number): Vector2 {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    this.x -= origin.x;
    this.y -= origin.y;

    const xNew = this.x * c - this.y * s;
    const yNew = this.x * s + this.y * c;

    this.x = xNew + origin.x;
    this.y = yNew + origin.y;
    return this;
  }

  public randomize(): Vector2 {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    return this;
  }

  public randomize01(): Vector2 {
    this.x = Math.random();
    this.y = Math.random();
    return this;
  }

  public randomizeDisc(): Vector2 {
    do {
      this.randomize();
    } while (this.length() > 1);
    return this;
  }

  /* STATIC, RETURNS PRIMITIVE TYPE */

  public static dot(a: Vector2, b: Vector2): number {
    return a.x * b.x + a.y * b.y;
  }

  public static distance(a: Vector2, b: Vector2): number {
    const dx = a.x - b.x,
      dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* STATIC, MODIFIES OUT */
  public static transformMat2(a: Vector2, transformMatrix: Matrix2x2) {
    const x = a.x,
      y = a.y,
      m = transformMatrix.m;
    const out = new Vector2();
    out.x = m[0] * x + m[2] * y + m[4];
    out.y = m[1] * x + m[3] * y + m[5];
    return out;
  }

  public static transformMat3(a: Vector2, transformMatrix: Matrix2x2) {
    const x = a.x,
      y = a.y,
      m = transformMatrix.m;
    const out = new Vector2();
    out.x = m[0] * x + m[3] * y + m[6];
    out.y = m[1] * x + m[4] * y + m[7];
    return out;
  }

  public static transformMat4(a: Vector2, transformMatrix: Matrix2x2) {
    const x = a.x,
      y = a.y,
      m = transformMatrix.m;
    const out = new Vector2();
    out.x = m[0] * x + m[4] * y + m[12];
    out.y = m[1] * x + m[5] * y + m[13];
    return out;
  }

  public static multiplyScalar(a: Vector2, s: number): Vector2 {
    const out = new Vector2();
    out.x = a.x * s;
    out.y = a.y * s;
    return out;
  }

  public static add(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x + b.x, a.y + b.y);
  }

  public static subtract(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x - b.x, a.y - b.y);
  }

  public static lerp(a: Vector2, b: Vector2, t: number): Vector2 {
    const ax = a.x,
      ay = a.y;
    return new Vector2(ax + t * (b.x - ax), ay + t * (b.y - ay));
  }

  public static fract(p: Vector2): Vector2 {
    return Vector2.subtract(p, Vector2.floor(p));
  }

  public static floor(p: Vector2): Vector2 {
    return new Vector2(Math.floor(p.x), Math.floor(p.y));
  }

  public static normalize(v: Vector2): Vector2 {
    let l = v.x * v.x + v.y * v.y;
    if (l > 0) {
      l = 1 / Math.sqrt(l);
    }
    return v.clone().multiplyScalar(l);
  }
}
