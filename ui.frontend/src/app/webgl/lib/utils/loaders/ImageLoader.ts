import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';

export default class ImageLoader implements IWebGLPreloadable {
  public image!: HTMLImageElement;
  private url: string;

  constructor(preloader: WebGLPreLoader, url: string) {
    this.url = url;
    preloader.add(this);
  }

  public load(callback: () => void): void {
    this.image = LoadUtils.loadImage(this.url, (image: HTMLImageElement) => {
      this.image = image;
      callback.call(this);
    });
  }

  public get width(): number {
    return this.image?.width || 0;
  }

  public get height(): number {
    return this.image?.height || 0;
  }
}
