import Vector3 from '../math/Vector3';

export default class Utils {
  public static posMod(x: number, m: number): number {
    return ((x % m) + m) % m;
  }

  public static fract(x: number): number {
    return x - Math.floor(x);
  }

  public static lerp(a: number, b: number, i: number): number {
    return (1 - i) * a + i * b;
  }

  //exponential interpolation. Use for camera zooms etc
  public static eerp(a: number, b: number, i: number): number {
    return a * Math.pow(b / a, i);
  }

  public static map(a: number, b: number, i: number): number {
    return Utils.clamp01((i - a) / (b - a));
  }

  public static inverseLerp(a: number, b: number, i: number): number {
    return Utils.map(a, b, i);
  }

  public static clamp01(x: number): number {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

  // use for smoothstep or inverse smoothstep with controllable exponent
  // https://www.shadertoy.com/view/ldBfR1
  public static gain01(x: number, P: number) {
    if (x > 0.5) {
      return 1.0 - 0.5 * Math.pow(2.0 - 2.0 * x, P);
    } else {
      return 0.5 * Math.pow(2.0 * x, P);
    }
  }

  public static smootherStep01(x: number): number {
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  public static smoothStep01(x: number): number {
    x = Utils.clamp01(x);
    return x * x * (3 - 2 * x);
  }

  public static invSmoothStep01(x: number): number {
    x = Utils.clamp01(x);
    return 0.5 - Math.sin(Math.asin(1.0 - 2.0 * x) / 3.0);
  }

  public static smoothStep(e0: number, e1: number, x: number): number {
    x = Utils.clamp((x - e0) / (e1 - e0), 0.0, 1.0);
    return x * x * (3 - 2 * x);
  }

  public static smootherStep(e0: number, e1: number, x: number): number {
    x = Utils.clamp((x - e0) / (e1 - e0), 0.0, 1.0);
    return Utils.smootherStep01(x);
  }

  public static lineairStep(e0: number, e1: number, x: number): number {
    return Utils.clamp01((x - e0) / (e1 - e0));
  }

  public static nearestPowerOfTwo(x: number): number {
    return Math.pow(2, Math.round(Math.log2(x)));
  }

  public static nextPowerOfTwo(x: number): number {
    return Math.pow(2, Math.ceil(Math.log2(x)));
  }

  public static isPowerOfTwo(x: number): boolean {
    return (x & (x - 1)) === 0;
  }

  public static isNumber(test: any): boolean {
    return typeof test === 'number';
  }

  public static smallerPowerOfTwo(x: number): number {
    return Math.pow(2, Math.floor(Math.log2(x)));
  }

  public static clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  public static degToRad(d: number): number {
    return d * (Math.PI / 180);
  }

  public static radToDeg(r: number): number {
    return r * (180 / Math.PI);
  }

  public static degToRadVec3(d: Vector3): Vector3 {
    return new Vector3(Utils.degToRad(d.x), Utils.degToRad(d.y), Utils.degToRad(d.z));
  }

  public static radToDegVec3(r: Vector3): Vector3 {
    return new Vector3(Utils.radToDeg(r.x), Utils.radToDeg(r.y), Utils.radToDeg(r.z));
  }

  public static latLongToCartesian(
    out: Vector3,
    lat: number,
    lon: number,
    radius: number,
  ): Vector3 {
    const latRad = this.degToRad(lat);
    const longRad = this.degToRad(lon) + Math.PI;

    out.z = radius * Math.cos(latRad) * Math.cos(longRad);
    out.x = radius * Math.cos(latRad) * Math.sin(longRad);
    out.y = radius * Math.sin(latRad);

    return out;
  }

  public static Approximately(a: number, b: number): Boolean {
    return Math.abs(a - b) < 0.000001;
  }
}
