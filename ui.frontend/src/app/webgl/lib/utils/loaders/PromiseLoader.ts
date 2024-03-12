import IWebGLPreloadable from '../../renderer/core/IWebGLPreloadable';
import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';

export default class PromiseLoader<T = any> implements IWebGLPreloadable {
  private _promise: Promise<T>;
  public loaded: boolean = false;
  private _data: T | undefined;

  constructor(preloader: WebGLPreLoader, promise: Promise<T>) {
    this._promise = promise;
    preloader.add(this);
  }

  public get data(): T {
    if (this._data === undefined) {
      throw new Error(`Trying to get PromiseLoader.data but the promise has not yet resolved`);
    }

    return this._data;
  }

  public load(callback: () => void): void {
    this._promise.then((data: T) => {
      this._data = data;
      this.loaded = true;
      callback.call(this);
    });
  }
}
