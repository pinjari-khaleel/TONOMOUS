import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Camera from '../../renderer/camera/Camera';
import Time from '../../renderer/core/Time';
import Vector3 from '../../renderer/math/Vector3';
import MouseListener from '../../renderer/input/MouseListener';
import Renderer from '../../renderer/render/Renderer';
import Key from '../input/Key';
import KeyListener from '../input/KeyListener';
import StreetviewRotationController from '../input/StreetviewRotationController';

export default class FlyCamera extends Camera {
  private _renderer: Renderer;
  private _translateSpeed: Vector3 = new Vector3();

  protected _mouseListener: MouseListener;

  private _right: Vector3 = new Vector3();
  private _invertMouse: boolean;
  protected _translateSpeedModifier: number = 10.0;
  protected _dampingModifier: number = 1.0;

  private _rotationController: StreetviewRotationController;

  constructor(
    renderer: Renderer,
    fov: number = 1,
    nearPlane: number = 0.01,
    farPlane: number = 100,
    invertMouse: boolean = true,
  ) {
    super(fov, nearPlane, farPlane);

    this._renderer = renderer;
    this._invertMouse = invertMouse;

    this._mouseListener = renderer.mouseListener;

    this._rotationController = new StreetviewRotationController(renderer, invertMouse);
  }

  public set eulerXY(rot: Vector2) {
    this._rotationController.eulerXY = rot;
  }

  public lookAt(pos: Vector3, target: Vector3, up: Vector3 = Vector3.UP): void {
    super.lookAt(pos, target, up);
    this._rotationController.rotation = this.view.transform.rotation;
  }

  public resetSpeed() {
    this._translateSpeed.setValues(0, 0, 0);
    this._rotationController.resetSpeed();
  }

  private forward(amount: number) {
    const forward: Vector3 = this.view.transform.forward;
    forward.multiplyScalar(this._translateSpeedModifier * amount * Time.instance.deltaTime);
    this._translateSpeed.add(forward);
  }

  private sideWays(amount: number) {
    this._right = this.view.transform.right;
    this._right.multiplyScalar(-this._translateSpeedModifier * amount * Time.instance.deltaTime);
    this._translateSpeed.add(this._right);
  }

  private rotateBy(rot: Vector2) {
    this._rotationController.rotateBy(rot);
    this.view.transform.rotation = this._rotationController.rotation;
  }

  public update(): void {
    this.projection.aspectRatio = this._renderer.aspectRatio;

    if (KeyListener.getKeyCodeDown(Key.ARROW_LEFT)) {
      this.sideWays(1);
    }
    if (KeyListener.getKeyCodeDown(Key.ARROW_RIGHT)) {
      this.sideWays(-1);
    }
    if (KeyListener.getKeyCodeDown(Key.ARROW_UP)) {
      this.forward(-1);
    }
    if (KeyListener.getKeyCodeDown(Key.ARROW_DOWN)) {
      this.forward(1);
    }

    if (KeyListener.getKeyCodeDown(Key.KEY_A)) {
      this.sideWays(1);
    }
    if (KeyListener.getKeyCodeDown(Key.KEY_D)) {
      this.sideWays(-1);
    }
    if (KeyListener.getKeyCodeDown(Key.KEY_W)) {
      this.forward(-1);
    }
    if (KeyListener.getKeyCodeDown(Key.KEY_S)) {
      this.forward(1);
    }

    this.view.transform.translate(this._translateSpeed);
    this._translateSpeed.multiplyScalar(Math.pow(0.95, this._dampingModifier));
    this._rotationController.update(this);

    this.view.transform.rotation = this._rotationController.rotation;
  }

  public getMouseDown(): boolean {
    return this._mouseListener.mouseDown;
  }

  public getMouseSpeed(): Vector2 {
    if (this._mouseListener.mouseDown) {
      return this._mouseListener.normalizedVelocity;
    } else {
      return new Vector2();
    }
  }

  public setTranslateSpeed(speed: number) {
    this._translateSpeedModifier = speed;
  }

  public getTranslateSpeed() {
    return this._translateSpeedModifier;
  }

  public setDamping(damping: number) {
    this._dampingModifier = damping;
  }
}
