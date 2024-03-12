import Time from 'mediamonks-webgl/renderer/core/Time';
import RotationController from 'mediamonks-webgl/utils/input/RotationController';
import MouseListener from 'mediamonks-webgl/renderer/input/MouseListener';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import Utils from 'mediamonks-webgl/renderer/core/Utils';

export default class StreetviewRotationController extends RotationController {
  private mouseListener: MouseListener;
  private renderer: Renderer;

  public static MOUSE_MOVEMENT_CANCEL_TRIGGER: number = 0.0025;

  private static MAX_ROTATE_SPEED: number = 0.175;
  private mouseDown: boolean = false;

  private _eulerSpeed: Vector2 = new Vector2();

  private _rotating: boolean = false;
  private _rotatingLerp: number = 0;
  private _rotatingLerpPrev: number = 0;
  //-1 indicates no limit
  private _rotationLimit: Vector2 = new Vector2(1.4, -1);
  private _clampEuler: boolean;

  private _rotationSpeedMultiplier: number = 5;

  constructor(renderer: Renderer, mouseInverse: boolean, clampEuler: boolean = true) {
    super(mouseInverse);
    this.renderer = renderer;
    this.mouseListener = renderer.mouseListener;
    this._clampEuler = clampEuler;
  }

  public update(camera: Camera): void {
    const mouseDownPreviousFrame = this.mouseDown;
    this.mouseDown = this.mouseListener.mouseDown;

    const fov = camera.projection.FOV;
    const z = 0.5 / Math.tan(fov * 0.5);
    const fovH = Math.atan2(this.renderer.aspectRatio * 0.5, z) * 2;

    const mm = this.mouseSpeed;

    if (mm.length() > StreetviewRotationController.MOUSE_MOVEMENT_CANCEL_TRIGGER) {
      this.mouseListener.cancelClick();
    }

    if (this.mouseDown && mouseDownPreviousFrame) {
      const v = this._rotationSpeedMultiplier;
      this._eulerSpeed.setValues(
        v * mm.y * fov * this._mouseInverseValue,
        v * mm.x * fovH * this._mouseInverseValue,
      );
      this._rotating = this._eulerSpeed.length() > 0;

      this._rotatingLerp = this._rotating ? 0.5 : 0;
      this._rotatingLerpPrev = this._rotatingLerp;

      this.rotateBy(this._eulerSpeed);
      this._eulerSpeed.setValues(
        Math.min(StreetviewRotationController.MAX_ROTATE_SPEED, Math.abs(this._eulerSpeed.x)) *
          Math.sign(this._eulerSpeed.x),
        Math.min(StreetviewRotationController.MAX_ROTATE_SPEED, Math.abs(this._eulerSpeed.y)) *
          Math.sign(this._eulerSpeed.y),
      );
    } else {
      this._rotatingLerp = Utils.clamp01(this._rotatingLerp - Time.instance.deltaTime);
      this._rotating = this._rotatingLerp > 0;
      if (this._rotating) {
        this._eulerSpeed.multiplyScalar(
          1 - (this._rotatingLerpPrev - this._rotatingLerp) / this._rotatingLerpPrev,
        );
        this.rotateBy(this._eulerSpeed);
      }
      this._rotatingLerpPrev = this._rotatingLerp;
    }
  }

  public set rotationSpeedMultiplier(m: number) {
    this._rotationSpeedMultiplier = m;
  }

  public resetSpeed() {
    this.mouseDown = false;
    this._eulerSpeed.setValues(0, 0);
  }

  public get rotationSpeed(): Vector2 {
    return this._eulerSpeed;
  }

  public rotateBy(rot: Vector2) {
    this._eulerXY.add(rot);

    if (this._clampEuler) {
      if (this._rotationLimit.x >= 0)
        this._eulerXY.x = Utils.clamp(
          this._eulerXY.x,
          -this._rotationLimit.x,
          this._rotationLimit.x,
        );
      if (this._rotationLimit.y >= 0)
        this._eulerXY.y = Utils.clamp(
          this._eulerXY.y,
          -this._rotationLimit.y,
          this._rotationLimit.y,
        );
    }
    this._transform.eulerXY = this._eulerXY;
  }

  public set rotationLimit(v: Vector2) {
    this._rotationLimit.copy(v);
  }

  public get rotating(): boolean {
    return this._rotating;
  }

  private get mouseSpeed(): Vector2 {
    if (this.mouseListener.mouseDown) {
      return this.mouseListener.normalizedVelocity;
    } else {
      return new Vector2();
    }
  }
}
