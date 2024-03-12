import IWebGLPreloadable from './IWebGLPreloadable';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import IWebGLDestructible from './IWebGLDestructible';

export default class WebGLPreLoader implements IWebGLDestructible {
  private progress: number = 0;

  private loadsRequested: {
    preloadable: IWebGLPreloadable;
    loading: boolean;
    loaded: boolean;
    callbacks: ((() => void) | null)[];
  }[] = [];
  private callback: (() => void) | null = null;
  private progressCallBack: ((percentage: number) => void) | null = null;
  private _loading: boolean = false;

  public add<T extends IWebGLPreloadable>(preloadable: T, callback: (() => void) | null = null): T {
    const data = {
      preloadable,
      loading: false,
      loaded: false,
      callbacks: [callback],
    };

    this.loadsRequested.push(data);

    if (this.loading) {
      // add preloadable while preloader is loading, so directly start
      // this download
      this.loadPreloadable(data);
    }
    return preloadable;
  }

  public load(
    callback: (() => void) | null = null,
    progressCallBack: ((percentage: number) => void) | null = null,
  ): void {
    if (this.loading) {
      console.error('preloader already started');
      return;
    }
    this.callback = callback;
    this.progressCallBack = progressCallBack;
    this._loading = true;

    this.loadsRequested.forEach((data) => {
      this.loadPreloadable(data);
    });

    if (this.loadsRequested.length === 0) {
      if (this.callback) {
        this.callback();
        this.callback = null;
      }
    }
  }

  public get loading(): boolean {
    return this._loading;
  }

  public setCallbackForPreloadable(
    preloadable: IWebGLPreloadable,
    callback: (() => void) | null = null,
  ) {
    this.getPreloadable(preloadable)?.callbacks.push(callback);
  }

  private getPreloadable(preloadable: IWebGLPreloadable) {
    return this.loadsRequested.find((a) => a.preloadable === preloadable);
  }

  private loadPreloadable(data: {
    preloadable: IWebGLPreloadable;
    loading: boolean;
    loaded: boolean;
    callbacks: ((() => void) | null)[];
  }) {
    if (!data.loading && !data.loaded) {
      data.loading = true;
      data.preloadable.load(() => {
        this.loadDoneCallback(data);
      });
    }
  }

  private loadDoneCallback(data: {
    preloadable: IWebGLPreloadable;
    loading: boolean;
    loaded: boolean;
    callbacks: ((() => void) | null)[];
  }) {
    if (data.loaded) {
      return;
    }

    data.loaded = true;
    data.callbacks.forEach((callback) => {
      if (callback) {
        callback();
      }
    });

    const loadsCompleted = this.loadsRequested.filter((a) => a.loaded).length;

    // (c) Windows load progress
    this.progress += (1 - this.progress) / (1 + this.loadsRequested.length - loadsCompleted);

    if (this.progressCallBack) {
      if (this.loadsRequested.length) {
        this.progressCallBack(Utils.clamp01(this.progress));
      } else {
        this.progressCallBack(1);
      }
    }

    // check if all requested loads are loaded
    if (loadsCompleted >= this.loadsRequested.length) {
      if (this.callback) {
        this.callback();
        this.callback = null;
      }
    }
  }

  destruct() {
    this.callback = null;
    this.loadsRequested = [];
  }
}
