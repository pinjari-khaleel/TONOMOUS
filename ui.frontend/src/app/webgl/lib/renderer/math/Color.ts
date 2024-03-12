import Vector4 from './Vector4';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';

export default class Color extends Vector4 {
  get r(): number {
    return this.x;
  }

  get g(): number {
    return this.y;
  }

  get b(): number {
    return this.z;
  }

  get a(): number {
    return this.w;
  }

  set r(value: number) {
    this.x = value;
  }

  set g(value: number) {
    this.y = value;
  }

  set b(value: number) {
    this.z = value;
  }

  set a(value: number) {
    this.w = value;
  }

  public static get ZERO(): Color {
    return new Color(0, 0, 0, 0);
  }

  public static get ONE(): Color {
    return new Color(1, 1, 1, 1);
  }

  public clone(): Color {
    return new Color(this.x, this.y, this.z, this.w);
  }

  public get rgbString(): string {
    return (
      'rgb(' +
      Math.round(this.r * 255) +
      ',' +
      Math.round(this.g * 255) +
      ',' +
      Math.round(this.b * 255) +
      ')'
    );
  }

  public get rgbaString(): string {
    return (
      'rgba(' +
      Math.round(this.r * 255) +
      ', ' +
      Math.round(this.g * 255) +
      ', ' +
      Math.round(this.b * 255) +
      ', ' +
      this.a +
      ')'
    );
  }

  public get hex(): string {
    return (
      '#' +
      Color.componentToHex(this.r) +
      Color.componentToHex(this.g) +
      Color.componentToHex(this.b)
    );
  }

  public get rgbaArray(): number[] {
    return [Math.round(this.r * 255), Math.round(this.g * 255), Math.round(this.b * 255), this.a];
  }

  public get vector3(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  public get gammaToLinearSpace(): Color {
    // Use Unity conversion

    // Approximate version from http://chilliant.blogspot.com.au/2012/08/srgb-approximations-for-hlsl.html?m=1
    // return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);

    return Color.multiply(
      this,
      Color.multiply(
        this,
        Color.multiplyScalar(this, 0.305306011).addScalar(0.682171111),
      ).addScalar(0.012522878),
    );
  }

  public get linearToGammaSpace(): Color {
    // Use Unity conversion

    // linRGB = max(linRGB, vec3(0, 0, 0));
    // An almost-perfect approximation from http://chilliant.blogspot.com.au/2012/08/srgb-approximations-for-hlsl.html?m=1
    // return max(1.055 * pow(linRGB, vec3(0.416666667)) - 0.055, vec3(0));

    const linRGB = Color.max(this, Color.ZERO);
    return Color.max(
      linRGB.powScalar(0.416666667).multiplyScalar(1.055).addScalar(-0.055),
      Color.ZERO,
    );
  }

  public static get random(): Color {
    return new Color(Math.random(), Math.random(), Math.random());
  }

  // does not always return rounded numbers (sometimes a number is x.999999 and the hex value is invalid
  public static componentToHex(c: number): string {
    const hex = ((c * 255) | 0).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  public setRGBA255(value: number[]): Color {
    this.r = value[0] / 255;
    this.g = value[1] / 255;
    this.b = value[2] / 255;
    this.a = value[3];
    return this;
  }

  public setHex(hex: string): Color {
    hex = hex.replace(/[^0-9A-F]/gi, '');
    const bigint: number = parseInt(hex, 16);
    this.r = ((bigint >> 16) & 255) / 255;
    this.g = ((bigint >> 8) & 255) / 255;
    this.b = (bigint & 255) / 255;
    this.a = 1;
    return this;
  }

  // provide normalized hsv
  public setHSV(h: number, s: number, v: number): Color {
    let r = 0;
    let g = 0;
    let b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  public static fromHex(hex: string): Color {
    return new Color().setHex(hex);
  }

  public static fromRGB255(value: number[]): Color {
    return new Color().setRGBA255(value);
  }

  public static fromHSV(h: number, s: number, v: number): Color {
    return new Color().setHSV(h, s, v);
  }
}
