import IWebGLPreloadable from '../../renderer/core/IWebGLPreloadable';
import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import Mesh from '../../renderer/mesh/Mesh';
import Renderer from '../../renderer/render/Renderer';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';

export default class MeshJSONLoader extends Mesh implements IWebGLPreloadable {
  private urlOrJson: string | Object;
  private storeData: boolean;

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader | null,
    urlOrJson: string | Object | Promise<any>,
    storeData: boolean = false,
  ) {
    super(renderer);

    this.storeData = storeData;
    this.urlOrJson = urlOrJson;
    if (preloader !== null) {
      preloader.add(this);
    }
  }

  public load(callback: () => void): void {
    LoadUtils.loadJSON(this.urlOrJson, (data) => {
      this.setJSONData(data, this.storeData);
      callback.call(this);
    });
  }
}
