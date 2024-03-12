import Vector3 from '../../renderer/math/Vector3';
import Curve from './Curve';

export default class CurveCubicBezier extends Curve {
  public v1: Vector3 = new Vector3();
  public v2: Vector3 = new Vector3();
  public v3: Vector3 = new Vector3();
  public v4: Vector3 = new Vector3();

  constructor(v1: Vector3, v2: Vector3, v3: Vector3, v4: Vector3) {
    super();

    this.v1.copy(v1);
    this.v2.copy(v2);
    this.v3.copy(v3);
    this.v4.copy(v4);
  }

  public getPoints(asLineSegments: boolean = true, divisions: number = 4): Vector3[] {
    const points = [];

    for (let i = 0; i < divisions; i++) {
      const v1 = new Vector3();
      this.getPoint(i / divisions, v1);
      points.push(v1);
      if (asLineSegments) {
        const v2 = new Vector3();
        this.getPoint((i + 1) / divisions, v2);
        points.push(v2);
      }
    }
    return points;
  }

  // return a point on curve (t: 0 - 1)
  public getPoint(t: number, out: Vector3): void {
    if (t <= 0) {
      out.copy(this.v1);
    } else if (t >= 1) {
      out.copy(this.v4);
    }

    out.copy(Vector3.bezier(this.v1, this.v2, this.v3, this.v4, t));

    //
    // out.setValues(
    // 	this.CubicBezier(t, this.v1.x, this.v2.x, this.v3.x, this.v4.x),
    // 	this.CubicBezier(t, this.v1.y, this.v2.y, this.v3.y, this.v4.y),
    // 	this.CubicBezier(t, this.v1.z, this.v2.z, this.v3.z, this.v4.z),
    // );
  }

  // private CubicBezierP0(t: number, p: number): number {
  // 	const k = 1 - t;
  // 	return k * k * k * p;
  // }
  //
  // private CubicBezierP1(t: number, p: number): number {
  // 	const k = 1 - t;
  // 	return 3 * k * k * t * p;
  // }
  //
  // private CubicBezierP2(t: number, p: number): number {
  // 	return 3 * (1 - t) * t * t * p;
  // }
  //
  // private CubicBezierP3(t: number, p: number): number {
  // 	return t * t * t * p;
  // }
  //
  // private CubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  // 	return this.CubicBezierP0(t, p0) + this.CubicBezierP1(t, p1) + this.CubicBezierP2(t, p2) + this.CubicBezierP3(t, p3);
  // }
}
