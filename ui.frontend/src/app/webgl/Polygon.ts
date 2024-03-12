import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Matrix2x2 from './lib/renderer/math/Matrix2x2';
import Quaternion from './lib/renderer/math/Quaternion';

export default class Polygon {
  public points: Array<Vector2> = [];

  public get center(): Vector2 {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    this.points.forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minX, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxX, p.y);
    });

    return new Vector2(
      maxX - minX,
      maxY - minY
    );
  }

  constructor(points: ReadonlyArray<[number, number]>) {
    this.points = points.map(p => new Vector2(...p));
  }

  public multiplyScalar(s: number): Polygon {
    this.points.forEach((p) => {
      p.multiplyScalar(s);
    })

    return this;
  }

  public multiply(s: Vector2): Polygon {
    this.points.forEach((p) => {
      p.multiply(s)
    })

    return this;
  }

  public translate(v: Vector2): Polygon {
    this.points.forEach((p) => p.add(v));

    return this;
  }

  public toArray(): ReadonlyArray<[number, number]> {
    return this.points.map(p => [p.x, p.y]);
  }
}
