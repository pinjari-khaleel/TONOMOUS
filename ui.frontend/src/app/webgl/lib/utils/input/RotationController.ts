import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Transform from 'mediamonks-webgl/renderer/core/Transform';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import Quaternion from 'mediamonks-webgl/renderer/math/Quaternion';

export default class RotationController {
  protected _eulerXY = new Vector2();
  protected _transform: Transform = new Transform();
  protected _mouseInverseValue: number = 1;

  constructor(mouseInverse: boolean) {
    this._mouseInverseValue = mouseInverse ? -1 : 1;
  }

  public getTransform(): Transform {
    return this._transform;
  }

  public get eulerXY(): Vector2 {
    return this._eulerXY;
  }

  public update(camera: Camera) {}

  public set eulerXY(rot: Vector2) {
    this._eulerXY.copy(rot);
    this._transform.eulerXY = rot;
  }

  public setEulerValues(x: number, y: number) {
    this._eulerXY.setValues(x, y);
    this._transform.eulerXY = this._eulerXY;
  }

  public set rotation(rotation: Quaternion) {
    this._transform.rotation = rotation;
    const rot = this._transform.euler;
    this._eulerXY.setValues(rot.x, rot.y);
  }

  public get rotation(): Quaternion {
    return this._transform.rotation;
  }

  public setMouseInverted(inverted: boolean) {
    this._mouseInverseValue = inverted ? -1 : 1;
  }

  public getMouseInverted() {
    return this._mouseInverseValue < 0;
  }
}
