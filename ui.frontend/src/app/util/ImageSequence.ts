import EventDispatcher from 'seng-event';
import { DisposableManager } from 'seng-disposable-manager';
import fitRect from 'fit-rect';
import LoadImageTask from 'task-loader/lib/task/LoadImageTask';
import Direction from '../data/enum/Direction';
import { TweenMax } from 'gsap';
import { fadeFromTo } from '../animation/fade';

export interface ImageSequenceOptions {
  element: HTMLElement | null;
  startCount: number;
  frameCount: number;
  padCount: number;
  source: string | null;
  objectFit?: string;
  fps: number;
}

export default class ImageSequence extends EventDispatcher {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private direction: Direction = Direction.FORWARD;
  private loadImageTask!: LoadImageTask;
  private size: { width: number; height: number } = { width: 0, height: 0 };
  private frame: number = 0;
  private readonly disposableManager: DisposableManager;

  public isLoaded = false;

  private sources: Array<string> = [];
  private readonly options: ImageSequenceOptions = {
    startCount: 0,
    frameCount: 0,
    padCount: 0,
    source: null,
    element: null,
    fps: 24,
    objectFit: 'contain',
  };

  private images: Array<{ asset: HTMLImageElement; index: number }> = [];

  constructor(options: ImageSequenceOptions) {
    super();

    this.options = Object.assign(this.options, options);
    this.disposableManager = new DisposableManager();
  }

  public setup(): void {
    this.canvas = <HTMLCanvasElement>(<HTMLElement>this.options.element).querySelector('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.frame =
      this.direction === Direction.FORWARD ? this.options.startCount : this.options.frameCount;

    this.prepareSources();

    TweenMax.set(<HTMLElement>this.options.element, {
      autoAlpha: 0,
    });
  }

  public async load(): Promise<void> {
    fadeFromTo(<HTMLElement>this.options.element);
    await this.loadImages();
    this.handleResize();
    this.isLoaded = true;
    this.drawFrame(0);
  }

  private prepareSources(): void {
    this.sources = [];
    if (this.options.source) {
      for (let i = this.options.startCount; i <= this.options.frameCount; i += 1) {
        this.sources.push(
          `${this.options.source.replace(
            '{frame}',
            (<any>i.toString()).padStart(this.options.padCount, '0'),
          )}`,
        );
      }
    }
  }

  private async loadImages(): Promise<void> {
    this.loadImageTask = new LoadImageTask({
      assets: this.sources,
      onAssetLoaded: (result) => {
        this.images[result.index] = result;
      },
    });

    await this.loadImageTask.load().then(() => {
      this.loadImageTask.dispose();
    });
  }

  private getImageByFrame(frame: number = this.frame): { asset: HTMLImageElement; index: number } {
    return this.images[frame];
  }

  public drawFrame(frame: number = this.frame): void {
    const image = this.getImageByFrame(frame);

    if (image) {
      const rect = fitRect(
        [0, 0, image.asset.naturalWidth, image.asset.naturalHeight],
        [0, 0, this.size.width, this.size.height],
        this.options.objectFit,
      );

      this.ctx.clearRect(0, 0, this.size.width, this.size.height);
      this.ctx.drawImage(image.asset, rect[0], rect[1], rect[2], rect[3]);
    }
  }

  public handleResize(size: { width: number; height: number } = { width: 0, height: 0 }): void {
    this.size.width =
      size.width || (<HTMLElement>this.options.element).offsetWidth * window.devicePixelRatio;
    this.size.height =
      size.height || (<HTMLElement>this.options.element).offsetHeight * window.devicePixelRatio;

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;

    if (this.getImageByFrame(this.frame)) {
      this.drawFrame();
    }
  }

  public dispose(): void {
    if (this.loadImageTask) {
      this.loadImageTask.dispose();
    }

    if (this.disposableManager) {
      this.disposableManager.dispose();
    }

    super.dispose();
  }
}
