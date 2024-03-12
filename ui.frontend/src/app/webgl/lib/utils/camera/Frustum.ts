import Vector4 from 'mediamonks-webgl/renderer/math/Vector4';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import AABox from '../../renderer/math/AABox';
import Utils from 'mediamonks-webgl/renderer/core/Utils';

export default class Frustum {
  private planes: Vector4[] = [];
  public points: Vector3[] = [];

  constructor() {
    for (let i: number = 0; i < 6; ++i) {
      this.planes.push(new Vector4());
    }
    for (let i: number = 0; i < 8; ++i) {
      this.points.push(new Vector3());
    }
  }

  public updateForCamera(camera: Camera) {
    this.updateForViewProjectionMatrix(camera.viewProjection);

    //create 8 world space frustum corners. Needed for frustum/ frustum intersection
    const fc = camera.projection.frustumCorner;
    const v = camera.view.transform.worldMatrix;
    let i = 0;
    for (let z = 0; z <= 1; z++) {
      for (let y = 0; y <= 1; y++) {
        for (let x = 0; x <= 1; x++) {
          const p = fc.clone();
          p.multiplyScalar(Utils.lerp(camera.projection.nearPlane, camera.projection.farPlane, z));
          p.x *= x * 2 - 1;
          p.y *= y * 2 - 1;
          p.z *= -1;
          this.points[i++] = Vector3.transform(p, v);
        }
      }
    }
  }

  public updateForViewProjectionMatrix(viewProjection: Matrix4x4) {
    const vp = viewProjection.m;

    // Right clipping plane.
    this.planes[0].setValues(vp[3] - vp[0], vp[7] - vp[4], vp[11] - vp[8], vp[15] - vp[12]);
    // Left clipping plane.
    this.planes[1].setValues(vp[3] + vp[0], vp[7] + vp[4], vp[11] + vp[8], vp[15] + vp[12]);
    // Bottom clipping plane.
    this.planes[2].setValues(vp[3] + vp[1], vp[7] + vp[5], vp[11] + vp[9], vp[15] + vp[13]);
    // Top clipping plane.
    this.planes[3].setValues(vp[3] - vp[1], vp[7] - vp[5], vp[11] - vp[9], vp[15] - vp[13]);
    // Far clipping plane.
    this.planes[4].setValues(vp[3] - vp[2], vp[7] - vp[6], vp[11] - vp[10], vp[15] - vp[14]);
    // Near clipping plane.
    this.planes[5].setValues(vp[3] + vp[2], vp[7] + vp[6], vp[11] + vp[10], vp[15] + vp[14]);

    this.planes.forEach((plane) => {
      plane.multiplyScalar(1 / Math.sqrt(plane.x ** 2 + plane.y ** 2 + plane.z ** 2));
    });
  }

  //https://www.yosoygames.com.ar/wp/2016/12/frustum-vs-pyramid-intersection-also-frustum-vs-frustum/
  public frustumInFrustum(frustum: Frustum): boolean {
    let intersects = true;

    for (let i = 0; i < 6; ++i) {
      let isAnyVertexInPositiveSide = false;
      for (let j = 0; j < 8; ++j) {
        const dot = this.dot3(this.planes[i], frustum.points[j]);
        isAnyVertexInPositiveSide = isAnyVertexInPositiveSide || dot > 0;
      }
      intersects = intersects && isAnyVertexInPositiveSide;
    }

    for (let i = 0; i < 6; ++i) {
      let isAnyVertexInPositiveSide = false;
      for (let j = 0; j < 8; ++j) {
        const dot = this.dot3(frustum.planes[i], this.points[j]);
        isAnyVertexInPositiveSide = isAnyVertexInPositiveSide || dot > 0;
      }
      intersects = intersects && isAnyVertexInPositiveSide;
    }
    return intersects;
  }

  public pointInFrustum(p: Vector3): boolean {
    return this.sphereInFrustum(p, 0);
  }

  public sphereInFrustum(p: Vector3, radius: number): boolean {
    for (let i: number = 0; i < 6; i++) {
      if (this.dot(this.planes[i], p.x, p.y, p.z) < -radius) {
        return false;
      }
    }
    return true;
  }

  public boxInFrustum(min: Vector3, max: Vector3): boolean {
    for (let i: number = 0; i < 6; i++) {
      if (
        this.dot(this.planes[i], min.x, min.y, min.z) < 0.0 &&
        this.dot(this.planes[i], max.x, min.y, min.z) < 0.0 &&
        this.dot(this.planes[i], min.x, max.y, min.z) < 0.0 &&
        this.dot(this.planes[i], max.x, max.y, min.z) < 0.0 &&
        this.dot(this.planes[i], min.x, min.y, max.z) < 0.0 &&
        this.dot(this.planes[i], max.x, min.y, max.z) < 0.0 &&
        this.dot(this.planes[i], min.x, max.y, max.z) < 0.0 &&
        this.dot(this.planes[i], max.x, max.y, max.z) < 0.0
      ) {
        return false;
      }
    }
    return true;
  }

  public aaBoxInFrustum(box: AABox): boolean {
    return this.boxInFrustum(box.min, box.max);
  }

  private dot(plane: Vector4, x: number, y: number, z: number) {
    return plane.x * x + plane.y * y + plane.z * z + plane.w;
  }
  private dot3(plane: Vector4, p: Vector3) {
    return plane.x * p.x + plane.y * p.y + plane.z * p.z + plane.w;
  }
}
