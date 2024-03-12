import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';

export default class ImportLoader<T = any, TExportName extends string = 'default'>
  implements IWebGLPreloadable {
  /**
   * Can be used to add modules which are loaded with the import() function to a preloader.
   *
   * @example const myTextFile = new ImportLoader<string>(preloader, './path/to/some.txt');
   * // after preloader has completed
   * console.log(myTextFile.data); // data contains the literal content of the text file as a string
   *
   * @example const myJsonObject = new ImportLoader<string>(preloader, './path/to/some.json');
   * // after preloader has completed
   * console.log(myTextFile.data); // NOTE: data here contains the *parsed* JSON as javascript object
   */
  private importPromise: Promise<{ [P in TExportName]: T }>;
  private exportName: TExportName;
  public loaded: boolean = false;
  private _data: T | undefined;

  constructor(
    preloader: WebGLPreLoader,
    promise: Promise<{ [P in TExportName]: T }>,
    exportName?: TExportName,
  ) {
    this.exportName = exportName || <TExportName>'default';
    this.importPromise = promise;
    preloader.add(this);
  }

  public get data(): T {
    if (this._data === undefined) {
      throw new Error('data is being read from ImportLoader but it has not finished loading');
    }
    return this._data;
  }

  public load(callback: () => void): void {
    this.importPromise.then((data) => {
      this._data = data[this.exportName];
      this.loaded = true;
      callback.call(this);
    });
  }
}
