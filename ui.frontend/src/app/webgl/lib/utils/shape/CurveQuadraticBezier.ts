import Vector3 from '../../renderer/math/Vector3';
import Curve from './Curve';

export default class CurveQuadraticBezier extends Curve {
  public v1: Vector3 = new Vector3();
  public v2: Vector3 = new Vector3();
  public v3: Vector3 = new Vector3();

  constructor(v1: Vector3, v2: Vector3, v3: Vector3) {
    super();

    this.v1.copy(v1);
    this.v2.copy(v2);
    this.v3.copy(v3);
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
      out.copy(this.v3);
    }

    out.setValues(
      this.QuadraticBezier(t, this.v1.x, this.v2.x, this.v3.x),
      this.QuadraticBezier(t, this.v1.y, this.v2.y, this.v3.y),
      this.QuadraticBezier(t, this.v1.z, this.v2.z, this.v3.z),
    );
  }

  private QuadraticBezierP0(t: number, p: number): number {
    const k = 1 - t;
    return k * k * p;
  }

  private QuadraticBezierP1(t: number, p: number): number {
    return 2 * (1 - t) * t * p;
  }

  private QuadraticBezierP2(t: number, p: number): number {
    return t * t * p;
  }

  private QuadraticBezier(t: number, p0: number, p1: number, p2: number): number {
    return (
      this.QuadraticBezierP0(t, p0) + this.QuadraticBezierP1(t, p1) + this.QuadraticBezierP2(t, p2)
    );
  }
}
