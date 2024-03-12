import Vector3 from '../../renderer/math/Vector3';
import Path from './Path';

export default class PathBatch {
  public paths: Path[] = [];
  public closed: boolean = true;

  private _currentPath: Path | undefined;

  constructor(closed: boolean = true) {
    this.closed = closed;
  }

  public moveTo(p: Vector3): void {
    this._currentPath = new Path(this.closed);
    this.paths.push(this._currentPath);
    this._currentPath.moveTo(p);
  }

  public lineTo(p: Vector3): void {
    if (this._currentPath === undefined) {
      throw new ReferenceError('cannot lineTo: path not started');
    }
    this._currentPath.lineTo(p);
  }

  public bezierCurveTo(cP1: Vector3, cP2: Vector3, p: Vector3): void {
    if (this._currentPath === undefined) {
      throw new ReferenceError('cannot bezierCurveTo: path not started');
    }
    this._currentPath.bezierCurveTo(cP1, cP2, p);
  }

  public quadraticCurveTo(cP: Vector3, p: Vector3): void {
    if (this._currentPath === undefined) {
      throw new ReferenceError('cannot quadraticCurveTo: path not started');
    }
    this._currentPath.quadraticCurveTo(cP, p);
  }

  public close(): void {
    if (this._currentPath === undefined) {
      throw new ReferenceError('cannot close path: path not started');
    }
    const out = new Vector3();
    this._currentPath.getPoint(0, out);
    if (Vector3.distance(out, this._currentPath.currentPoint) > 0) {
      this.lineTo(out);
    }
  }

  // if spacing >= 0, points are evenly spaced along path. Otherwise, divisions are used for curves and
  // straight lines are drawn using 2 points.
  //
  // return all points and index buffer of start indices of all paths in pathbatch
  //

  public getPoints(
    divisions: number = 4,
    spacing: number = 0,
  ): { points: Vector3[]; indices: number[] } {
    let points: Vector3[] = [];
    let indices: number[] = [];
    let total: number = 0;

    for (let i = 0; i < this.paths.length; i++) {
      const pathPoints = this.paths[i].getPoints(divisions, spacing);

      indices.push(total);
      points = points.concat(pathPoints);

      total += pathPoints.length;
    }
    return { points: points, indices: indices };
  }
}
