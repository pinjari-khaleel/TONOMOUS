import IWebGLDestructible from './IWebGLDestructible';

export default class CanvasManager implements IWebGLDestructible {
  public readonly canvas: HTMLCanvasElement;

  private readonly _canvasParent: HTMLElement | null;

  public pixelRatio: number = 1;

  public constructor(canvasParent: HTMLElement | null) {
    this._canvasParent = canvasParent;

    if (canvasParent) {
      if (canvasParent.offsetWidth * canvasParent.offsetHeight < 1)
        console.error('canvasParent has no area', canvasParent);
    }
    this.canvas = this.prepareCanvas(canvasParent);

    if (window['devicePixelRatio']) {
      this.pixelRatio = window['devicePixelRatio'];
    }
  }

  private prepareCanvas(canvasParent: HTMLElement | null): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
    canvas.setAttribute('id', 'canvas');

    canvas.style.position = 'absolute';
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    if (canvasParent) {
      canvas.style.width = canvasParent.offsetWidth + 'px';
      canvas.style.height = canvasParent.offsetHeight + 'px';
      canvasParent.appendChild(canvas);
    }
    return canvas;
  }

  public get canvasParent(): HTMLElement {
    return <HTMLElement>this._canvasParent;
  }

  public update(dt: number): boolean {
    if (this.canvasParent) {
      const boundingRect = this.canvasParent.getBoundingClientRect();
      let w = boundingRect.width;
      let h = boundingRect.height;
      if (w * h > 0) {
        return this.setSize(w, h);
      } else {
        console.warn('canvasParent has no area', this._canvasParent);
      }
    }
    return false;
  }

  public setSize(w: number, h: number): boolean {
    if (
      this.canvas.width !== ((w * this.pixelRatio) | 0) ||
      this.canvas.height !== ((h * this.pixelRatio) | 0)
    ) {
      this.canvas.width = (w * this.pixelRatio) | 0;
      this.canvas.height = (h * this.pixelRatio) | 0;

      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';

      const event = document.createEvent('Event');
      event.initEvent('resize', false, true);
      this.canvas.dispatchEvent(event);

      return true;
    } else {
      return false;
    }
  }

  destruct() {
    this.canvas.width = 1;
    this.canvas.height = 1;
    if (this._canvasParent) {
      this._canvasParent.removeChild(this.canvas);
    }
  }
}
