import bowser from 'bowser';
import Camera from '../../renderer/camera/Camera';
import Quaternion from '../../renderer/math/Quaternion';
import Transform from '../../renderer/core/Transform';
import Vector3 from '../../renderer/math/Vector3';
import MouseListener from '../../renderer/input/MouseListener';
import Renderer from '../../renderer/render/Renderer';
import Gyroscope from '../input/Gyroscope';
import StreetviewRotationController from 'mediamonks-webgl/utils/input/StreetviewRotationController';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';

export default class OrbitCamera extends Camera {
  public pivot: Transform = new Transform();
  public gyroscope: Gyroscope | null = null;

  private renderer: Renderer;

  private mouseListener: MouseListener;
  private hoverPivot: Transform = new Transform();

  private _euler: Vector3 = new Vector3();

  private currentFov: number = 1.4;
  private minFov: number = 0.7;
  private maxFov: number = 2.1;
  private zoomTargetDistance: number = 0;
  private distanceLimit: Vector2 = new Vector2(0, 1e20);

  protected _rotationController: StreetviewRotationController;

  // hover
  private hoverEnabled: boolean = false;
  private hoverStrength: number = 0;
  private hoverMaxAngle: number = 1 / Math.PI;
  private hoverMouseTarget: Vector2 = new Vector2();

  constructor(
    renderer: Renderer,
    fov: number = 1,
    nearPlane: number = 0.01,
    farPlane: number = 100,
    zPosition: number = 1,
    mouseInverse: boolean = true,
    enableGyroscope: boolean = true,
    clampEuler: boolean = true,
    scrollZoom: boolean = true,
  ) {
    super(fov, nearPlane, farPlane);

    this.renderer = renderer;
    this.pivot.setPositionValues(0, 0, 0);
    this.hoverPivot.setParent(this.pivot);
    this.view.transform.setParent(this.hoverPivot);
    this.distance = zPosition;

    this.mouseListener = renderer.mouseListener;
    if (scrollZoom) {
      this.mouseListener.addWheelEvent((e: number) => this.scrollZoom(e));
    }

    // this._rotationController = new MouseRotationController(this.renderer, 0.85, mouseInverse? -mouseResponse: mouseResponse);
    this._rotationController = new StreetviewRotationController(
      this.renderer,
      mouseInverse,
      clampEuler,
    );

    if (bowser.mobile && enableGyroscope) {
      this.enableGyroscope();
    }
    if (bowser.mobile && scrollZoom) {
      this.enablePinch();
    }
  }

  public lookAt(pos: Vector3, target: Vector3, up: Vector3 = Vector3.UP): void {
    this.pivot.lookAt(pos, target, up);
    this.pivot.position = target;
    this.view.transform.setPositionValues(0, 0, Vector3.distance(pos, target));
    this.zoomTargetDistance = this.distance;
  }

  public setHoverEnabled(enabled: boolean, maxAngle = 1 / Math.PI, animated: boolean = true) {
    this.hoverEnabled = enabled;
    this.hoverMaxAngle = maxAngle;
    if (!animated) {
      this.hoverStrength = enabled ? 1 : 0;
    }
  }

  public scrollZoom(e: number): void {
    let z: number = this.zoomTargetDistance;
    if (e > 0) {
      z /= 1.05;
    } else {
      z *= 1.05;
    }
    z = Utils.clamp(z, this.distanceLimit.x, this.distanceLimit.y);
    this.zoomTargetDistance = z;
  }

  public setDistanceLimit(min: number, max: number) {
    this.distanceLimit.setValues(min, max);
  }

  public update(disableRotationController: boolean = false): void {
    this.projection.aspectRatio = this.renderer.aspectRatio;

    if (this.zoomTargetDistance === 0) {
      this.zoomTargetDistance = this.distance;
    }

    if (!disableRotationController) {
      this._rotationController.update(this);

      if (this.distance != this.zoomTargetDistance) {
        const d = Utils.lerp(this.zoomTargetDistance, this.distance, 0.9);
        this.view.transform.setPositionValues(0, 0, d);
      }
    }

    if (this.gyroscope) {
      this.pivot.rotation = Quaternion.slerp(this.pivot.rotation, this.gyroscope.rotation, 0.1);
    } else {
      let mouseRotation = this._rotationController.eulerXY;
      this._euler.x = mouseRotation.x;
      this._euler.y = mouseRotation.y;
      this.pivot.euler = this._euler;
    }

    // hover
    this.hoverStrength = Utils.clamp01(this.hoverStrength + (this.hoverEnabled ? 1 / 60 : -1 / 60));
    this.hoverMouseTarget = Vector2.lerp(this.hoverMouseTarget, this.mouseListener.screenPos, 0.02);
    const maxAngle =
      this.hoverStrength *
      this.hoverMaxAngle *
      (this.rotationController.getMouseInverted() ? -1 : 1);
    this.hoverPivot.setEulerValues(
      this.hoverMouseTarget.y * maxAngle,
      -this.hoverMouseTarget.x * maxAngle * this.renderer.aspectRatio,
      0,
    );
  }

  public get rotationController(): StreetviewRotationController {
    return this._rotationController;
  }

  public set rotation(rotation: Quaternion) {
    this._rotationController.rotation = rotation;
    this.pivot.euler = this._euler;
  }

  /**
   * @param value: in radians
   */
  public set eulerX(value: number) {
    this._euler.x = value;
    this._rotationController.setEulerValues(this._euler.x, this._euler.y);
    this.pivot.euler = this._euler;
  }

  public get eulerX(): number {
    return this._euler.x;
  }

  /**
   * @param value: in radians
   */
  public set eulerY(value: number) {
    this._euler.y = value;
    this._rotationController.setEulerValues(this._euler.x, this._euler.y);
    this.pivot.euler = this._euler;
  }

  public get eulerY(): number {
    return this._euler.y;
  }

  /**
   * @param value: in radians
   */
  public set eulerZ(value: number) {
    this._euler.z = value;
    this.pivot.euler = this._euler;
  }

  public get euler(): Vector3 {
    return this._euler.clone();
  }

  public set distance(value: number) {
    this.zoomTargetDistance = value;
    this.view.transform.setPositionValues(0, 0, value);
  }

  public get distance(): number {
    return this.view.transform.position.z;
  }

  public disableGyroscope() {
    this.gyroscope = null;
  }

  public enableGyroscope() {
    if (!this.gyroscope) {
      this.gyroscope = new Gyroscope();
    }
  }

  public enablePinch() {
    this.currentFov = this.projection.FOV;
    this.minFov = (this.projection.FOV * 1) / 2;
    this.maxFov = (this.projection.FOV * 3) / 2;

    this.renderer.canvas.addEventListener(
      'gestureend',
      (e: any) => {
        const fov = Math.max(Math.min((1 / e.scale) * this.currentFov, this.maxFov), this.minFov);
        this.projection.FOV = fov;
        this.currentFov = fov;
        e.preventDefault();
      },
      false,
    );

    this.renderer.canvas.addEventListener(
      'gesturechange',
      (e: any) => {
        const fov = Math.max(Math.min((1 / e.scale) * this.currentFov, this.maxFov), this.minFov);
        this.projection.FOV = fov;
        e.preventDefault();
      },
      false,
    );
  }
}
