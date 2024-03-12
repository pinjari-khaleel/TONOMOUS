import RotationController from 'mediamonks-webgl/utils/input/RotationController';
import MouseListener from 'mediamonks-webgl/renderer/input/MouseListener';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';

export default class MouseRotationController extends RotationController {
  private mouseListener: MouseListener;
  private inertia: number;
  private response: number;
  private rxSpeed: number = 0;
  private rySpeed: number = 0;

  constructor(
    renderer: Renderer,
    inertia: number = 0.95,
    response: number = 0.0174533,
    mouseInverse: boolean = false,
  ) {
    super(mouseInverse);
    this.inertia = inertia;
    this.response = response;

    this.mouseListener = renderer.mouseListener;
  }

  public update(camera: Camera): void {
    this.rySpeed *= this.inertia;
    this.rxSpeed *= this.inertia;

    if (this.mouseListener.mouseDown) {
      const ms: Vector2 = this.mouseListener.normalizedVelocity;
      this.rySpeed -= ms.x * this.response * this._mouseInverseValue;
      this.rxSpeed -= ms.y * this.response * this._mouseInverseValue;
    }
    this._eulerXY.x += this.rxSpeed;
    this._eulerXY.y += this.rySpeed;
  }

  public set mouseResponse(value: number) {
    this.response = value;
  }
}
