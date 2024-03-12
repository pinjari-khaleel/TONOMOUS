import IWebGLPreloadable from '../../renderer/core/IWebGLPreloadable';
import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';

export default class JSONLoader implements IWebGLPreloadable {
  public data: any;

  private urlOrJson: string | Object;

  constructor(preloader: WebGLPreLoader | null, urlOrJson: string | Object | Promise<any>) {
    this.urlOrJson = urlOrJson;
    if (preloader !== null) {
      preloader.add(this);
    }
  }

  public load(callback: () => void): void {
    LoadUtils.loadJSON(this.urlOrJson, (data) => {
      this.data = data;
      callback.call(this);
    });
  }
}
