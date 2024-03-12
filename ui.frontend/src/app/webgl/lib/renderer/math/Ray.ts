import Vector2 from './Vector2';
import Vector3 from './Vector3';
import Camera from '../camera/Camera';
import Vector4 from './Vector4';
import Matrix4x4 from './Matrix4x4';

export default class Ray {
  public ro = new Vector3();
  public rd = new Vector3();

  private oc = new Vector3();

  private static tempMat4 = new Matrix4x4();
  private static tempVec4 = new Vector4();

  constructor(ro: Vector3 | null = null, rd: Vector3 | null = null) {
    if (ro) this.ro.copy(ro);
    if (rd) this.rd.copy(rd);
  }

  public setVectors(ro: Vector3, rd: Vector3) {
    this.ro.copy(ro);
    this.rd.copy(rd);
  }

  public setFromCamera(camera: Camera, uv: Vector2): void {
    this.ro = camera.view.worldPosition;
    Matrix4x4.invert(Ray.tempMat4, camera.projection.matrix);
    Ray.tempVec4.setValues(uv.x, uv.y, 1, 1);
    Ray.tempVec4.transform(Ray.tempMat4);
    Ray.tempVec4.z = -1;
    Ray.tempVec4.w = 0;
    Matrix4x4.invert(Ray.tempMat4, camera.view.matrix);
    Ray.tempVec4.transform(Ray.tempMat4);

    this.rd.x = Ray.tempVec4.x;
    this.rd.y = Ray.tempVec4.y;
    this.rd.z = Ray.tempVec4.z;

    this.rd.normalize();
  }

  public intersectTriangle(v0: Vector3, v1: Vector3, v2: Vector3, result: Vector3): void {
    result.z = -1;

    // this is guessed
    const kEpsilon = 0.0001;

    const v0v1 = Vector3.subtract(v1, v0);
    const v0v2 = Vector3.subtract(v2, v0);
    const pvec = Vector3.cross(this.rd, v0v2);

    let det = Vector3.dot(v0v1, pvec);

    if (det < kEpsilon) {
      return;
    }

    /*  if(culling){
		 if (det < kEpsilon) return -1;
		 }else{
		 if (Math.abs(det) < kEpsilon) return -1;
		 }*/

    const invDet = 1 / det;

    const tvec = Vector3.subtract(this.ro, v0);

    const u = Vector3.dot(tvec, pvec) * invDet;
    if (u < 0 || u > 1) {
      return;
    }

    const qvec = Vector3.cross(tvec, v0v1);

    const v = Vector3.dot(this.rd, qvec) * invDet;

    if (v < 0 || u + v > 1) {
      return;
    }

    const t = Vector3.dot(v0v2, qvec) * invDet;

    result.setValues(u, v, t);
    // return t;
  }

  public intersectBoundingBox(min: Vector3, max: Vector3): boolean {
    const t1 = (min.x - this.ro.x) / this.rd.x;
    const t2 = (max.x - this.ro.x) / this.rd.x;
    const t3 = (min.y - this.ro.y) / this.rd.y;
    const t4 = (max.y - this.ro.y) / this.rd.y;
    const t5 = (min.z - this.ro.z) / this.rd.z;
    const t6 = (max.z - this.ro.z) / this.rd.z;

    const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

    if (tmax < 0) return false;
    if (tmin > tmax) return false;

    return true;
  }

  public intersectCube(rad: Vector3, txx: Matrix4x4, intersection: Vector3 | null = null) {
    // convert from ray to box space
    const rdd4 = new Vector4(this.rd.x, this.rd.y, this.rd.z, 0);
    rdd4.transform(txx);
    const rdd = new Vector3(rdd4.x, rdd4.y, rdd4.z);

    const roo4 = new Vector4(this.ro.x, this.ro.y, this.ro.z, 1);
    roo4.transform(txx);
    const roo = new Vector3(roo4.x, roo4.y, roo4.z);

    // ray-box intersection in box space
    const m: Vector3 = new Vector3(1, 1, 1).divide(rdd);
    const n: Vector3 = m.clone().multiply(roo);
    const k: Vector3 = new Vector3(Math.abs(m.x), Math.abs(m.y), Math.abs(m.z)).multiply(rad);

    const t1: Vector3 = n.clone().multiplyScalar(-1).subtract(k);
    const t2: Vector3 = n.clone().multiplyScalar(-1).add(k);

    const tN = Math.max(Math.max(t1.x, t1.y), t1.z);
    const tF = Math.min(Math.min(t2.x, t2.y), t2.z);

    if (tN > tF || tF < 0.0) return false;

    if (intersection) {
      intersection.copy(this.rd);
      intersection.multiplyScalar(tN < 0 ? tF : tN);
      intersection.add(this.ro);
    }

    return true;
  }

  public intersectSphere(
    center: Vector3,
    radius: number,
    intersection: Vector3 | null = null,
  ): boolean {
    this.oc.copy(this.ro);
    this.oc.subtract(center);
    const b = Vector3.dot(this.oc, this.rd);
    const c = Vector3.dot(this.oc, this.oc) - radius * radius;
    const h = b * b - c;
    if (h < 0.0) {
      return false;
    }

    const dist = -b - Math.sqrt(h);
    if (dist < 0) {
      return false;
    }

    if (intersection) {
      intersection.copy(this.rd);
      intersection.multiplyScalar(dist);
      intersection.add(this.ro);
    }

    return true;
  }

  public intersectPlane(
    normal: Vector3,
    distance: number,
    intersection: Vector3 | null = null,
  ): boolean {
    const dist = -(Vector3.dot(normal, this.ro) + distance) / Vector3.dot(normal, this.rd);
    if (dist > 0) {
      if (intersection) {
        intersection.copy(this.rd);
        intersection.multiplyScalar(dist);
        intersection.add(this.ro);
      }
      return true;
    }
    return false;
  }

  public getClosestPointOnRayToPoint(p: Vector3): Vector3 {
    const a = this.ro;
    const b = a.clone().add(this.rd);

    const ap = Vector3.subtract(p, a);
    const ab = Vector3.subtract(b, a);

    const ab2 = ab.x * ab.x + ab.y * ab.y;
    const apAb = ap.x * ab.x + ap.y * ab.y;

    const t = apAb / ab2;

    return Vector3.multiplyScalar(ab, t).add(a);
  }
}
