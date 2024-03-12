import IWebGLPreloadable from '../../renderer/core/IWebGLPreloadable';
import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';

export default class TextLoader implements IWebGLPreloadable {
  public loaded: boolean = false;

  private url: string;
  private _text: string | undefined;

  constructor(preloader: WebGLPreLoader, url: string) {
    this.url = url;
    preloader.add(this);
  }

  public get text(): string {
    if (this._text === undefined) {
      throw new Error(
        `Trying to get TextLoader.text property but loading is not complete for: ${this.url}`,
      );
    }
    return this._text;
  }

  public load(callback: () => void): void {
    LoadUtils.loadText(this.url, (text: string) => {
      this._text = text;
      this.loaded = true;
      callback.call(this);
    });
  }
}
