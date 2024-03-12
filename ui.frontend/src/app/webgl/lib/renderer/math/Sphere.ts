import Vector3 from './Vector3';

export default class Sphere {
  public center: Vector3 = new Vector3();
  public radius: number = 0;

  constructor(center: Vector3 | null, radius: number | null) {
    if (center) this.center.copy(center);
    if (radius) this.radius = radius;
  }
}
