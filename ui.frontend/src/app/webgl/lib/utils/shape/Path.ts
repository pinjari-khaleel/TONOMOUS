import Vector3 from '../../renderer/math/Vector3';
import Curve from './Curve';
import CurveCubicBezier from './CurveCubicBezier';
import CurveLine from './CurveLine';
import CurveQuadraticBezier from './CurveQuadraticBezier';

export default class Path {
  public currentPoint: Vector3 = new Vector3();
  public curves: Curve[] = [];

  public closed: boolean = true;

  private _cachedLength: number = -1;
  private _cachedLengths: number[] = [];

  constructor(closed: boolean = true) {
    this.closed = closed;
  }

  public moveTo(p: Vector3): void {
    this.currentPoint.copy(p);
  }

  public lineTo(p: Vector3): void {
    var curve = new CurveLine(this.currentPoint, p);
    this.curves.push(curve);
    this.currentPoint.copy(p);
  }

  public quadraticCurveTo(cP: Vector3, p: Vector3): void {
    var curve = new CurveQuadraticBezier(this.currentPoint, cP, p);
    this.curves.push(curve);
    this.currentPoint.copy(p);
  }

  public bezierCurveTo(cP1: Vector3, cP2: Vector3, p: Vector3): void {
    var curve = new CurveCubicBezier(this.currentPoint, cP1, cP2, p);
    this.curves.push(curve);
    this.currentPoint.copy(p);
  }

  // return a point on path (t: 0 - 1)
  public getPoint(t: number, out: Vector3, evenlySpaceOnCurves: boolean = true): void {
    const l = this.getLength();
    const d = t * l;
    let s = 0;

    for (let i = 0; i < this._cachedLengths.length; i++) {
      const de = this._cachedLengths[i] + s;
      if (d <= de) {
        const ct = (d - s) / (de - s);
        if (evenlySpaceOnCurves) {
          this.curves[i].getEvenlySpacedPoint(ct, out);
          return;
        } else {
          this.curves[i].getPoint(ct, out);
          return;
        }
      }
      s = de;
    }
    out.copy(Vector3.ZERO);
  }

  // length of path
  public getLength(): number {
    if (this._cachedLength >= 0) {
      return this._cachedLength;
    }

    this._cachedLength = 0;

    for (let i = 0; i < this.curves.length; i++) {
      this._cachedLengths.push(this.curves[i].getLength());
      this._cachedLength += this._cachedLengths[i];
    }

    return this._cachedLength;
  }

  // if spacing >= 0, points are evenly spaced along path. Otherwise, divisions are used for curves and
  // straight lines are drawn using 2 points.

  public getPoints(divisions: number = 4, spacing: number = 0): Vector3[] {
    let points: Vector3[] = [];

    if (spacing > 0) {
      const length = this.getLength();
      const numPoints = Math.max(1, (length / spacing + 1) | 0);
      const dt = 1 / numPoints;

      for (let j = 0; j < numPoints; j++) {
        const p = new Vector3();
        this.getPoint(j * dt, p);
        points.push(p);
      }
    } else {
      for (let i = 0; i < this.curves.length; i++) {
        points = points.concat(this.curves[i].getPoints(false, divisions));
      }
    }

    if (!this.closed) {
      const p = new Vector3();
      this.curves[this.curves.length - 1].getPoint(1, p);
      points.push(p);
    }

    return points;
  }
}
