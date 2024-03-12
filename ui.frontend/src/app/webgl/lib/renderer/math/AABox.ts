import Vector3 from './Vector3';

export default class AABox {
  public min: Vector3;
  public max: Vector3;

  constructor(
    min: Vector3 = new Vector3(1e38, 1e38, 1e38),
    max: Vector3 = new Vector3(-1e38, -1e38, -1e38),
  ) {
    this.min = min;
    this.max = max;
  }

  public get area(): number {
    const dim = Vector3.subtract(this.max, this.min);
    return 2 * (dim.x * dim.y + dim.y * dim.z + dim.z * dim.x);
  }

  public get center(): Vector3 {
    return Vector3.add(this.max, this.min).multiplyScalar(0.5);
  }

  public get extents(): Vector3 {
    return Vector3.subtract(this.max, this.min).multiplyScalar(0.5);
  }

  public setCenterExtents(c: Vector3, e: Vector3) {
    this.min = Vector3.subtract(c, e);
    this.max = Vector3.add(c, e);
  }

  public expandWithPoint(p: Vector3) {
    this.max.max(p);
    this.min.min(p);
  }

  public expandWithAABox(b: AABox) {
    this.max.max(b.max);
    this.min.min(b.min);
  }

  public copy(p: AABox) {
    this.min.copy(p.min);
    this.max.copy(p.max);
  }

  public clone(): AABox {
    return new AABox(this.min, this.max);
  }

  public static merge(boxes: AABox[]): AABox {
    const ret = new AABox();
    boxes.forEach((box) => {
      ret.expandWithAABox(box);
    });
    return ret;
  }
}
