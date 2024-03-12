import Time from '../../renderer/core/Time';
import Vector2 from '../math/Vector2';
import IWebGLDestructible from '../core/IWebGLDestructible';

class MouseButton {
  public down: boolean = false;
  public downThisFrame: boolean = false;
  public upThisFrame: boolean = false;
  public downByTouch: boolean = false; // touch device

  // click event can be canceled by mouse move (after .25 sec) or time out (for touch devices)
  public clickCanceled: boolean = false;
  public downTime: number = 0;
  public upTime: number = 0;
}

export default class MouseListener implements IWebGLDestructible {
  private _element: HTMLElement;
  private _canvas: HTMLElement;
  private _mousePos: Vector2 = new Vector2();
  private _previousMousePos: Vector2 = new Vector2();
  private _mouseVelocity: Vector2 = new Vector2();
  private _normalized: Vector2 = new Vector2();

  private _wheelCallbacks: ((dir: number) => void)[] = [];
  private _clickCallbacks: (() => void)[] = [];
  private _downCallbacks: (() => void)[] = [];
  private _dragCallbacks: ((distance: Vector2) => void)[] = [];

  private _buttons: MouseButton[] = [];
  private _manualUpdate: boolean = false;
  private _resetSpeed: boolean = false;

  private _preventDefault: boolean = false;
  private _dragCancelClick: boolean = true;

  private _updateRequest: any;

  constructor(element: HTMLElement, canvas: HTMLCanvasElement) {
    this._element = element;
    this._canvas = canvas;

    for (let i = 0; i < 3; i++) {
      this._buttons.push(new MouseButton());
    }

    this._element.addEventListener('touchstart', this._touchStartListener, false);
    this._element.addEventListener('touchmove', this._touchMoveListener, { passive: false });
    this._element.addEventListener('touchend', this._upListener, false);
    this._element.addEventListener('touchcancel', this._endListener, false);
    this._element.addEventListener('mousedown', this._mouseDownListener, false);
    this._element.addEventListener('mousemove', this._mouseMoveListener, false);
    this._element.addEventListener('mouseup', this._upListener, false);
    this._element.addEventListener('mousecancel', this._endListener, false);
    this._element.addEventListener('mouseout', this._endListener, false);
    this._element.addEventListener('wheel', this._mouseWheelListener, false);

    this.updateLoop();
  }

  // (0,0) x (1, 1)
  public get normalizedPos(): Vector2 {
    return this._normalized.clone();
  }

  // (-1,-1) x (1, 1)
  public get screenPos(): Vector2 {
    return this._mousePos.clone();
  }

  public get normalizedVelocity(): Vector2 {
    return this._mouseVelocity.clone();
  }

  public get mouseDown(): boolean {
    return this._buttons[0].down;
  }

  public get mouseDownThisFrame(): boolean {
    return this._buttons[0].downThisFrame;
  }

  public get mouseUpThisFrame(): boolean {
    return this._buttons[0].upThisFrame;
  }

  public get mouseDownRight(): boolean {
    return this._buttons[2].down;
  }

  public get mouseDownThisFrameRight(): boolean {
    return this._buttons[2].downThisFrame;
  }

  public getButton(index: number): MouseButton {
    return this._buttons[index];
  }

  private _touchStartListener = (e: TouchEvent) => {
    this.setMousePosition(e.targetTouches[0]);
    if (this._preventDefault) {
      e.preventDefault();
    }
    this._resetSpeed = true;
    this.handleMouseDown(0);
    this._buttons[0].downByTouch = true;
    for (let i = 0; i < this._downCallbacks.length; i++) {
      this._downCallbacks[i].call(this);
    }
  };

  private _touchMoveListener = (e: TouchEvent) => {
    this.setMousePosition(e.targetTouches[0]);

    if (this._preventDefault) {
      e.preventDefault();
    }
  };

  private _endListener = () => {
    for (const button of this._buttons) {
      button.down = false;
      button.downThisFrame = false;
      button.downByTouch = false;
      button.upThisFrame = true;
      button.upTime = 0;
      console.log();
    }
  };

  private _mouseDownListener = (e: MouseEvent) => {
    if (this._preventDefault) {
      e.preventDefault();
    }
    this.handleMouseDown(e.which - 1);
    this.setMousePosition(e);
    for (let i = 0; i < this._downCallbacks.length; i++) {
      this._downCallbacks[i].call(this);
    }
  };

  private _mouseMoveListener = (e: MouseEvent) => {
    this.setMousePosition(e);
    if (this._preventDefault) {
      e.preventDefault();
    }
    for (const button of this._buttons) {
      if (button.downTime > 0.25) {
        button.clickCanceled = true;
      }
    }
  };

  private _mouseWheelListener = (e: WheelEvent) => {
    for (let i = 0; i < this._wheelCallbacks.length; i++) {
      this._wheelCallbacks[i].call(this, Math.sign(-e.deltaY));
    }
  };

  private _upListener = () => {
    this._resetSpeed = true;
    if (!this._buttons[0].clickCanceled) {
      for (let i = 0; i < this._clickCallbacks.length; i++) {
        this._clickCallbacks[i].call(this);
      }
    }
    for (const button of this._buttons) {
      button.down = false;
      button.downThisFrame = false;
      button.upThisFrame = true;
      button.upTime = 0;
      button.downByTouch = false;
    }
  };

  public setPreventDefault(prevent: boolean) {
    this._preventDefault = prevent;
  }

  private handleMouseDown(i: number) {
    this._resetSpeed = true;
    if (this._buttons[i]) {
      this._buttons[i].down = true;
      this._buttons[i].downThisFrame = true;
      this._buttons[i].clickCanceled = false;
      this._buttons[i].downByTouch = false;
      this._buttons[i].downTime = 0;
    }
  }

  public addWheelEvent(callback: (dir: number) => void) {
    this._wheelCallbacks.push(callback);
  }

  public addClickEvent(callback: () => void) {
    this._clickCallbacks.push(callback);
  }

  public addDownEvent(callback: () => void) {
    this._downCallbacks.push(callback);
  }

  public addDragEvent(callback: (distance: Vector2) => void) {
    this._dragCallbacks.push(callback);
  }

  private setMousePosition(event: any): void {
    const bounds = this._canvas.getBoundingClientRect();
    this._mousePos.x = 2 * ((event.clientX - bounds.left) / bounds.width) - 1;
    this._mousePos.y = 1 - 2 * ((event.clientY - bounds.top) / bounds.height);
  }

  public updateManual() {
    this._manualUpdate = true;
    this.update();
  }

  private updateLoop(): void {
    if (this._manualUpdate) {
      return;
    }
    this.update();
    this._updateRequest = window.requestAnimationFrame(() => this.updateLoop());
  }

  private update(): void {
    this._normalized.x = this._mousePos.x * 0.5 + 0.5;
    this._normalized.y = -this._mousePos.y * 0.5 + 0.5;

    if (this._resetSpeed) {
      this._resetSpeed = false;
      this._mouseVelocity.setValues(0, 0);
    } else {
      this._mouseVelocity.x = this._normalized.x - this._previousMousePos.x;
      this._mouseVelocity.y = this._normalized.y - this._previousMousePos.y;
    }
    this._previousMousePos.copy(this._normalized);

    for (const button of this._buttons) {
      if (button.downTime > 0) {
        button.downThisFrame = false;
      }
      if (button.upTime > 0) {
        button.upThisFrame = false;
      }
      if (button.down) {
        button.downTime += Time.instance.deltaTime;
      } else {
        button.upTime += Time.instance.deltaTime;
      }
    }

    if (this.mouseDown && this._dragCallbacks.length > 0 && this._mouseVelocity.length() > 0) {
      this._dragCallbacks.forEach((callback) => callback(this._mouseVelocity));
    }

    if (this._dragCancelClick && this._mouseVelocity.length() > 0.01) {
      this.cancelClick();
    }
  }

  public cancelClick() {
    for (const button of this._buttons) {
      button.clickCanceled = true;
    }
  }

  destruct() {
    if (this._canvas) {
      this._canvas.removeEventListener('touchstart', this._touchStartListener, false);
      this._canvas.removeEventListener('touchmove', this._touchMoveListener, false);
      this._canvas.removeEventListener('touchend', this._upListener, false);
      this._canvas.removeEventListener('touchcancel', this._endListener, false);
      this._canvas.removeEventListener('mousedown', this._mouseDownListener, false);
      this._canvas.removeEventListener('mousemove', this._mouseMoveListener, false);
      this._canvas.removeEventListener('mouseend', this._endListener, false);
      this._canvas.removeEventListener('mousecancel', this._endListener, false);
      this._canvas.removeEventListener('mouseout', this._endListener, false);
      this._canvas.removeEventListener('wheel', this._mouseWheelListener, false);
      this._canvas.removeEventListener('mouseup', this._upListener, false);
    }
    window.cancelAnimationFrame(this._updateRequest);
    this._updateRequest = null;
  }
}
