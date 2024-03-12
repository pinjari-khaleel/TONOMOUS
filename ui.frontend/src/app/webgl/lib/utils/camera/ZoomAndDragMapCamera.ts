import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Tween from 'mediamonks-webgl/utils/animation/Tween';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
// import EventDispatcher from 'seng-event';
// import Hammer from 'hammerjs';
// import WebGLEvent from "../../../WebGLEvent";

export default class ZoomAndDragMapCamera extends Camera {
  public mapAspectRatio: number;
  public maxZoomFactor: number = 1.5;

  public minZoom: number = 0;
  public maxZoom: number = 1;

  public zoomTween: Tween = new Tween(0);
  public panTween: Tween<Vector2> = new Tween<Vector2>(new Vector2());
  private renderer: Renderer;

  private zoomLevel: number = 0;
  private targetZoom: number = 0;

  private center: Vector2 = new Vector2(0, 0);

  private mouseDownDrag: boolean = false;
  private mouseDownDragStarted: boolean = false;

  private mousePrevPosition: Vector2 = new Vector2();
  private mouseSpeed: Vector2 = new Vector2();

  private hammer: any;
  private zoomPinch: number = -1;
  private isPinching: boolean = false;

  constructor(
    renderer: Renderer,
    mapAspectRatio: number = 1,
    fov: number = 1,
    nearPlane: number = 0.01,
    farPlane: number = 10,
  ) {
    super(fov, nearPlane, farPlane);

    this.renderer = renderer;
    this.mapAspectRatio = mapAspectRatio;

    this.renderer.mouseListener.addWheelEvent((e) => this.scrollZoom(e));

    this.lookAt(new Vector3(0, 0, 5), new Vector3(0, 0, 0), new Vector3(0, 1, 0));

    // this.hammer = new Hammer(document.body);
    // this.addHammerPinch();
  }

  //public update(dt: number, eventDispatcher: EventDispatcher) {
  public update(dt: number) {
    this.projection.aspectRatio = this.renderer.aspectRatio;

    const currentZoom = this.zoomLevel;

    this.zoomTween.update(dt);
    this.panTween.update(dt);

    //this.updateScrollAndZoom(eventDispatcher);
    this.updateScrollAndZoom();

    /*    if (currentZoom != this.zoomLevel) {
          eventDispatcher.dispatchEvent(new WebGLEvent(WebGLEvent.MAP_ZOOM, { zoom: this.zoomLevel}));
        }*/
  }

  public getZoom(): number {
    return this.zoomLevel;
  }

  public setZoom(zoom: number, direct: boolean = false) {
    this.targetZoom = Utils.clamp(zoom, this.minZoom, this.maxZoom);
    if (direct) {
      this.zoomLevel = this.targetZoom;
    }
  }

  public reset() {
    this.zoomLevel = this.targetZoom = 0;
    this.center.setValues(0, 0);

    this.zoomTween.to(this.zoomLevel, 0);

    this.mouseDownDrag = false;
    this.mouseDownDragStarted = false;
  }

  private scrollZoom(e: number): void {
    let z: number = this.targetZoom;
    if (e < 0) {
      z = (z + 1) / 1.025 - 1;
    } else {
      z = (z + 1) * 1.025 - 1;
    }
    this.targetZoom = Utils.clamp(z, this.minZoom, this.maxZoom);
  }

  private addHammerPinch() {
    const ham = this.hammer;
    ham.get('pinch').set({ enable: true });
    ham.on('pinchstart', (e: { scale: number }) => {
      this.zoomPinch = Math.pow(2, this.targetZoom * 6);
      this.isPinching = true;
    });
    ham.on('pinch', (e: { scale: number }) => {
      this.handlePinch(e.scale);
    });
    ham.on('pinchend', (e: { scale: number }) => {
      this.handlePinch(e.scale);
      this.isPinching = false;
    });
  }

  private handlePinch(e: number) {
    this.targetZoom = Utils.clamp(Math.log2(this.zoomPinch * e) / 6, this.minZoom, this.maxZoom);
  }

  //private updateScrollAndZoom(eventDispatcher: EventDispatcher) {
  private updateScrollAndZoom() {
    const prevZoomLevel = this.zoomLevel;
    if (!this.zoomTween.completed) {
      this.zoomLevel = this.targetZoom = this.zoomTween.value;
    }

    this.zoomLevel = Utils.clamp(
      Utils.lerp(this.zoomLevel, this.targetZoom, 0.2),
      this.minZoom,
      this.maxZoom,
    );

    const minZoom = Math.max(this.renderer.aspectRatio / this.mapAspectRatio, 1);
    const maxZoom = minZoom * this.maxZoomFactor;

    const zoom = Utils.lerp(minZoom, maxZoom, this.zoomLevel);
    const prevZoom = Utils.lerp(minZoom, maxZoom, prevZoomLevel);

    const distance = 1 / zoom / Math.tan(this.projection.FOV * 0.5);
    const distanceOld = 1 / prevZoom / Math.tan(this.projection.FOV * 0.5);
    let fc = new Vector2(this.projection.frustumCorner.x, this.projection.frustumCorner.y);

    if (prevZoom !== zoom) {
      const offset = this.renderer.mouseListener.screenPos.multiply(fc);
      offset.multiplyScalar(distanceOld - distance);
      this.center.add(offset);
    }

    // move based on dragging
    if (this.renderer.mouseListener.mouseDown) {
      if (this.mouseDownDrag && !this.isPinching) {
        // dragging
        const delta = Vector2.subtract(
          this.renderer.mouseListener.screenPos,
          this.mousePrevPosition,
        );
        delta.x *= -this.renderer.aspectRatio;
        delta.y *= -1;
        delta.multiplyScalar(1 / zoom);
        this.mouseSpeed.copy(delta);
        this.mouseSpeed.multiplyScalar(0.75);
        this.center.add(delta);

        /*        if (!this.mouseDownDragStarted && delta.length() > 0) {
                  this.mouseDownDragStarted = true;
                  eventDispatcher.dispatchEvent(new WebGLEvent(WebGLEvent.MAP_DRAG_START, {}));
                  document.body.style.cursor = 'grabbing';
                }
                if(this.mouseDownDragStarted){
                  eventDispatcher.dispatchEvent(new WebGLEvent(WebGLEvent.MAP_CAMERA_DRAG, {}));
                }*/
      }
      this.mousePrevPosition = this.renderer.mouseListener.screenPos;
      this.mouseDownDrag = true;
    } else {
      /*      if (this.mouseDownDragStarted) {
              eventDispatcher.dispatchEvent(new WebGLEvent(WebGLEvent.MAP_DRAG_END, {}));
              document.body.style.cursor = 'grab';
            }*/
      this.mouseDownDrag = false;
      this.mouseDownDragStarted = false;
      this.mouseSpeed.multiplyScalar(0.9);
      this.center.add(this.mouseSpeed);
    }

    // move bounds into viewport
    const xbound = this.mapAspectRatio;
    const ybound = 1;
    const bounceDamping = 0.1;
    fc.multiplyScalar(distance);

    if (this.center.x - fc.x < -xbound) {
      this.center.x = -xbound + fc.x;
      this.mouseSpeed.x *= -bounceDamping;
    }
    if (this.center.x + fc.x > xbound) {
      this.center.x = xbound - fc.x;
      this.mouseSpeed.x *= -bounceDamping;
    }
    if (this.center.y - fc.y < -ybound) {
      this.center.y = -ybound + fc.y;
      this.mouseSpeed.y *= -bounceDamping;
    }
    if (this.center.y + fc.y > ybound) {
      this.center.y = ybound - fc.y;
      this.mouseSpeed.y *= -bounceDamping;
    }

    this.view.transform.setPositionValues(this.center.x, this.center.y, distance);
  }

  public setCenter(x: number, y: number) {
    this.center.setValues(x, y);
  }

  public goTo(p: Vector2, zoom: number, duration: number, onComplete: () => void): void {
    const cp = this.view.transform.position;

    this.panTween.fromTo(
      new Vector2(cp.x, cp.y),
      p,
      duration,
      () => {
        this.center.x = this.panTween.value.x;
        this.center.y = this.panTween.value.y;
      },
      onComplete,
    );
  }
}
