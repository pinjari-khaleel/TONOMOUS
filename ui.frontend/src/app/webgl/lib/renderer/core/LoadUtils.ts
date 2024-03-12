type CacheRegisterCallback = (data: any) => void;

export default class LoadUtils {
  private static clientCache: { [path: string]: boolean } = {};
  private static clientCacheCallbacks: { [path: string]: Array<CacheRegisterCallback> | null } = {};

  private static cacheIsPathRequested(path: string): any {
    return LoadUtils.clientCache[path];
  }

  private static cacheRegisterRequested(path: string): void {
    LoadUtils.clientCache[path] = true;
  }

  private static cacheRegisterCallback(path: string, callback: CacheRegisterCallback) {
    if (!LoadUtils.clientCacheCallbacks[path]) {
      LoadUtils.clientCacheCallbacks[path] = [];
    }
    (<Array<CacheRegisterCallback>>LoadUtils.clientCacheCallbacks[path]).push(callback);
  }

  private static cacheRequestDone(path: string, data: any) {
    const cbs = LoadUtils.clientCacheCallbacks[path];
    if (cbs) {
      for (let i = 0; i < cbs.length; i++) {
        cbs[i](data);
      }
    }
    LoadUtils.clientCacheCallbacks[path] = null;
    LoadUtils.clientCache[path] = false;
  }

  private static cacheRequestError(path: string) {
    const cbs = LoadUtils.clientCacheCallbacks[path];
    if (cbs) {
      for (let i = 0; i < cbs.length; i++) {
        cbs[i](null);
      }
    }
    LoadUtils.clientCacheCallbacks[path] = null;
    LoadUtils.clientCache[path] = false;
  }

  public static fetch(path: string, callback: (callback: Response) => void) {
    LoadUtils.cacheRegisterCallback(path, callback);

    if (LoadUtils.cacheIsPathRequested(path)) {
      return;
    }

    fetch(path)
      .then((response) => {
        LoadUtils.cacheRequestDone(path, response);
      })
      .catch(() => {
        LoadUtils.cacheRequestError(path);
      });
  }

  public static loadImage(
    path: string | { default: string },
    callback: (image: HTMLImageElement) => void,
  ): HTMLImageElement {
    if (typeof path !== 'string') {
      path = <string>path.default;
    }

    LoadUtils.cacheRegisterCallback(<string>path, callback);

    if (LoadUtils.cacheIsPathRequested(<string>path)) {
      return LoadUtils.cacheIsPathRequested(<string>path);
    }
    const image = new Image();

    LoadUtils.cacheRegisterRequested(<string>path);

    image.crossOrigin = 'Anonymous';

    image.onload = () => {
      LoadUtils.cacheRequestDone(<string>path, image);
    };
    image.onerror = () => {
      console.log('TextureLoader: could not load image', path);
      LoadUtils.cacheRequestDone(<string>path, image);
    };

    image.src = path;

    return image;
  }

  public static loadMultipleImages(
    paths: string[],
    callback: (images: HTMLImageElement[]) => void,
  ) {
    let imagesToLoad = paths.length;
    const images: HTMLImageElement[] = [];

    const receive = (i: number) => (image: HTMLImageElement) => {
      imagesToLoad--;
      images[i] = image;
      if (imagesToLoad === 0) {
        callback.call(this, images);
      }
    };

    for (let i = 0; i < paths.length; ++i) {
      LoadUtils.loadImage(paths[i], receive(i));
    }
  }

  public static loadText(
    urlOrText: string | Object | Promise<any>,
    callback: (text: string) => void,
  ) {
    if (typeof urlOrText === 'string') {
      LoadUtils.fetch(urlOrText, (response: Response) => {
        response
          .clone()
          .text()
          .then((data) => callback(data));
      });
    } else if (typeof (<Promise<any>>urlOrText).then === 'function') {
      (<Promise<any>>urlOrText).then((data) => {
        callback(data);
      });
    } else {
      console.warn('loadText: type not handled', typeof urlOrText, urlOrText);
      callback('error in loadText');
    }
  }

  public static loadJSON(urlOrJson: string | Object | Promise<any>, callback: (data: any) => void) {
    if (typeof urlOrJson === 'string') {
      LoadUtils.fetch(urlOrJson, (response: Response) => {
        response
          .clone()
          .json()
          .then((data) => callback(data));
      });
    } else if (typeof (<Promise<any>>urlOrJson).then === 'function') {
      (<Promise<any>>urlOrJson).then((data) => {
        callback(data);
      });
    } else {
      callback(urlOrJson);
    }
  }

  public static loadArrayBuffer(path: string, callback: (data: ArrayBuffer) => void) {
    LoadUtils.fetch(path, (response: Response) => {
      response
        .clone()
        .arrayBuffer()
        .then((data) => callback(data));
    });
  }

  public static loadMultipleTexts(paths: string[], callback: (...texts: string[]) => void) {
    let textsToLoad = paths.length;
    const texts: string[] = [];

    const receive = (i: number) => (text: string) => {
      textsToLoad--;
      texts[i] = text;
      if (textsToLoad === 0) {
        callback.apply(this, texts);
      }
    };

    for (let i = 0; i < paths.length; ++i) {
      LoadUtils.loadText(paths[i], receive(i));
    }
  }

  public static loadSingleFromRequireContext<T>(
    context: __WebpackModuleApi.RequireContext,
    path: string,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let module;
      try {
        module = context(`./${path.replace(/^\.\//, '')}`);
      } catch (e) {
        reject(e);
      }

      if (typeof module === 'function') {
        module(resolve);
      } else {
        resolve(module);
      }
    });
  }

  public static loadFromRequireContext<T>(
    context: __WebpackModuleApi.RequireContext,
    paths: Array<string>,
    callback: (modules: Array<T>) => void,
  ): void {
    Promise.all(
      paths.map((path) => LoadUtils.loadSingleFromRequireContext<T>(context, path)),
    ).then((modules) => callback(modules));
  }
}
