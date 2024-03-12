import Vector3 from '../../renderer/math/Vector3';

export default class Curve {
  protected _cachedLength: number = -1;
  private _cachedLengths: number[] = [];

  constructor() {}

  public getPoints(asLineSegments: boolean = true, divisions: number = 4): Vector3[] {
    return [];
  }

  // return a point on curve (t: 0 - 1)
  public getPoint(t: number, out: Vector3): void {
    out.copy(Vector3.ZERO);
  }

  // return a point on curve (t: 0 - 1), try to get it evenly spaced on curves
  public getEvenlySpacedPoint(t: number, out: Vector3): void {
    if (t <= 0) {
      this.getPoint(0, out);
    } else if (t >= 1) {
      this.getPoint(1, out);
    }

    const l = this.getLength();
    const d = t * l;
    let s = 0;

    for (let i = 0; i < this._cachedLengths.length; i++) {
      const de = this._cachedLengths[i] + s;
      if (d < de) {
        return this.getPoint(
          ((d - s) / this._cachedLengths[i] + i) / this._cachedLengths.length,
          out,
        );
      }
      s = de;
    }
  }

  // length of curve
  public getLength(): number {
    return this._cachedLength >= 0
      ? this._cachedLength
      : (this._cachedLength = this.calculateLength());
  }

  protected calculateLength(divisions: number = 10): number {
    let length = 0;
    const v1 = new Vector3();
    const v2 = new Vector3();

    for (let i = 0; i < divisions; i++) {
      this.getPoint(i / divisions, v1);
      this.getPoint((i + 1) / divisions, v2);
      this._cachedLengths.push(Vector3.distance(v1, v2));
      length += this._cachedLengths[i];
    }
    return length;
  }
}
