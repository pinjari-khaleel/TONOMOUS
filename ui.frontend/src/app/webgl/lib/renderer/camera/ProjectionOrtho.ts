import Projection from 'mediamonks-webgl/renderer/camera/Projection';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';

export default class ProjectionOrtho extends Projection {
  private _bottomLeft: Vector2 = new Vector2();
  private _topRight: Vector2 = new Vector2();

  constructor(
    changeCallback: () => void,
    bottomLeft: Vector2,
    topRight: Vector2,
    nearPlane: number = 0.01,
    farPlane: number = 10,
  ) {
    super(changeCallback, 1, nearPlane, farPlane);

    this._bottomLeft.copy(bottomLeft);
    this._topRight.copy(topRight);
  }

  protected updateMatrix() {
    if (!this.dirty) {
      return;
    }
    Matrix4x4.ortho(
      this.projectionMatrix,
      this._bottomLeft.x,
      this._topRight.x,
      this._bottomLeft.y,
      this._topRight.y,
      this._nearPlane,
      this._farPlane,
    );
    this.dirty = false;
  }
}
