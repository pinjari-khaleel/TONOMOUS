import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
import Vector4 from '../math/Vector4';
import Projection from './Projection';
import View from './View';
import Matrix4x4 from '../math/Matrix4x4';

export default class Camera {
  public readonly projection: Projection;
  public readonly view: View;
  public dirty: boolean = true;

  protected _viewProjection = new Matrix4x4();
  private tViewProjInv = new Matrix4x4();

  constructor(fov: number = 1, nearPlane: number = 0.01, farPlane: number = 10) {
    this.projection = new Projection(
      () => {
        this.dirty = true;
      },
      fov,
      nearPlane,
      farPlane,
    );

    this.view = new View(() => {
      this.dirty = true;
    });
  }

  public get worldPosition(): Vector3 {
    return this.view.worldPosition;
  }

  public lookAt(pos: Vector3, target: Vector3, up: Vector3 = Vector3.UP): void {
    this.view.transform.lookAt(pos, target, up);
  }

  public set position(pos: Vector3) {
    this.view.transform.position = pos;
  }

  public get viewProjection(): Matrix4x4 {
    this.updateViewProjection();
    return this._viewProjection;
  }

  public get projectionMatrix(): Matrix4x4 {
    return this.projection.matrix;
  }

  public get viewMatrix(): Matrix4x4 {
    return this.view.matrix;
  }

  protected updateViewProjection(): void {
    if (!this.dirty) {
      return;
    }
    Matrix4x4.multiply(this._viewProjection, this.projection.matrix, this.view.matrix);
    this.dirty = false;
  }

  public worldToScreenPoint(worldPos: Vector3): Vector4 {
    const out = new Vector4();
    out.x = worldPos.x;
    out.y = worldPos.y;
    out.z = worldPos.z;
    out.w = 1;

    out.transform(this.viewProjection);
    out.x /= out.w;
    out.y /= out.w;
    out.x = out.x * 0.5 + 0.5;
    out.y = out.y * -0.5 + 0.5;

    return out;
  }

  // accepts normalized screen pos [0->1]
  public screenToWorldPoint(screenPos: Vector2): Vector3 {
    Matrix4x4.invert(this.tViewProjInv, this.viewProjection);

    // from 0 - 1 to opengl coords
    const x = 2.0 * screenPos.x - 1;
    const y = -2.0 * screenPos.y + 1;
    return new Vector3(x, y, 1).transform(this.tViewProjInv);
  }

  public getDepth(worldPos: Vector3): number {
    return new Vector4(worldPos.x, worldPos.y, worldPos.z, 1).transform(this.viewProjection).z;
  }
}
