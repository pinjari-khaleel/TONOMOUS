import Vector3 from '../../renderer/math/Vector3';
import Curve from './Curve';

export default class CurveLine extends Curve {
  public v1: Vector3 = new Vector3();
  public v2: Vector3 = new Vector3();

  constructor(from: Vector3, to: Vector3) {
    super();

    this.v1.copy(from);
    this.v2.copy(to);
  }

  public getPoints(asLineSegments: boolean = true, divisions: number = 4): Vector3[] {
    return asLineSegments ? [this.v1, this.v2] : [this.v1];
  }

  // return a point on curve (t: 0 - 1)
  public getPoint(t: number, out: Vector3): void {
    if (t <= 0) {
      out.copy(this.v1);
    } else if (t >= 1) {
      out.copy(this.v2);
    }

    out.copy(this.v2);
    out.subtract(this.v1);
    out.multiplyScalar(t);
    out.add(this.v1);
  }

  public getEvenlySpacedPoint(t: number, out: Vector3): void {
    this.getPoint(t, out);
  }

  // length of curve
  public getLength(): number {
    return this._cachedLength >= 0
      ? this._cachedLength
      : (this._cachedLength = Vector3.distance(this.v1, this.v2));
  }
}
