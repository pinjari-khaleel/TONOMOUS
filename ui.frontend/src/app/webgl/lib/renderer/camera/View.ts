import Vector3 from '../math/Vector3';
import Transform from '../../renderer/core/Transform';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';

export default class View {
  public readonly transform: Transform = new Transform();

  private _dirty: boolean = true;
  private _viewMatrix = new Matrix4x4();
  private _rotationMatrix = new Matrix4x4();
  private _changeCallback: () => void;

  constructor(changeCallback: () => void) {
    this.transform.addChangeCallBack(() => {
      this.dirty = true;
    });
    this._changeCallback = changeCallback;
  }

  public get worldPosition(): Vector3 {
    return this.transform.worldPosition;
  }

  public set dirty(dirty: boolean) {
    if (this._dirty != dirty) {
      this._dirty = dirty;
      if (dirty) {
        this._changeCallback();
      }
    }
  }

  public get dirty(): boolean {
    return this._dirty;
  }

  public get matrix(): Matrix4x4 {
    this.updateMatrix();
    return this._viewMatrix;
  }

  private updateMatrix() {
    if (this.dirty) {
      Matrix4x4.invert(this._viewMatrix, this.transform.worldMatrix);
      this.dirty = false;
    }
  }

  public get worldRotationMatrix(): Matrix4x4 {
    Matrix4x4.invert(this._rotationMatrix, this.transform.worldRotationMatrixMat4);
    return this._rotationMatrix;
  }
}
