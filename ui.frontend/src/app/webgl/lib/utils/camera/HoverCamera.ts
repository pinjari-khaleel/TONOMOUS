import Time from '../../renderer/core/Time';
import Renderer from '../../renderer/render/Renderer';
import Transform from '../../renderer/core/Transform';
import Camera from '../../renderer/camera/Camera';
import MouseListener from '../../renderer/input/MouseListener';
import Vector3 from '../../renderer/math/Vector3';

export default class HoverCamera extends Camera {
  public _renderer: Renderer;
  public mouseResponse: number;
  public deviation: number;
  public pivot: Transform;
  private _mouseListener: MouseListener;
  public baseRotation: Vector3 = new Vector3();
  private _rotation: Vector3 = new Vector3();
  private _hover: Vector3 = new Vector3();
  private _zoomEnabled: boolean = true;

  constructor(
    renderer: Renderer,
    fov: number = 1,
    nearPlane: number = 0.01,
    farPlane: number = 100,
    zPosition: number = 1,
    deviation: number = 5 * (Math.PI / 180),
    response: number = 2,
  ) {
    super(fov, nearPlane, farPlane);

    this._renderer = renderer;
    this.deviation = deviation;
    this.mouseResponse = response;

    this.pivot = new Transform();
    this.pivot.setPositionValues(0, 0, 0);
    this.view.transform.setPositionValues(0, 0, zPosition);
    this.view.transform.setParent(this.pivot);

    this._mouseListener = renderer.mouseListener;
    this._mouseListener.addWheelEvent((e: number) => this.scrollZoom(e));
  }

  public scrollZoom(e: number): void {
    if (this._zoomEnabled) {
      let z: number = this.view.transform.position.z;
      if (e > 0) {
        z /= 1.05;
      } else {
        z *= 1.05;
      }
      this.view.transform.setPositionValues(0, 0, z);
    }
  }

  public setZoomEnabled(enabled: boolean) {
    this._zoomEnabled = enabled;
  }

  public update(): void {
    this.projection.aspectRatio = this._renderer.aspectRatio;

    const r = this._hover;
    let dt: number = Time.instance.deltaTime;
    dt *= this.mouseResponse;

    const sm = this._mouseListener.screenPos;
    r.x += (-sm.y * this.deviation - r.x) * dt;
    r.y += (sm.x * this.deviation - r.y) * dt;

    this._rotation.copy(this.baseRotation);
    this._rotation.add(r);

    this.pivot.euler = this._rotation;
    this.cullRevolutions();
  }

  public cullRevolutions(): void {
    const euler = this.pivot.euler;
    euler.y = ((euler.y + Math.PI) % (2 * Math.PI)) - Math.PI;
    euler.x = ((euler.x + Math.PI) % (2 * Math.PI)) - Math.PI;
    this.pivot.euler = euler;
  }

  public setZoom(value: number): void {
    this.view.transform.setPositionValues(0, 0, value);
  }
}
