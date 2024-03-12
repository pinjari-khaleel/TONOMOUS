import IWebGLPreloadable from '../../renderer/core/IWebGLPreloadable';
import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import Renderer from '../../renderer/render/Renderer';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';

export default class MeshesJSONLoader implements IWebGLPreloadable {
  public meshes: Mesh[] = [];

  private urlOrJson: string | Object;
  private renderer: Renderer;
  private finishedCallback: (() => void) | null;

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader | null,
    urlOrJson: string | Object | Promise<any>,
    finishedCallback: (() => void) | null = null,
  ) {
    this.renderer = renderer;
    this.finishedCallback = finishedCallback;

    this.urlOrJson = urlOrJson;

    if (preloader !== null) {
      preloader.add(this);
    }
  }

  public load(callback: () => void): void {
    LoadUtils.loadJSON(this.urlOrJson, (data) => {
      this.processData(data);
      callback.call(this);
    });
  }

  private processData(buffer: any) {
    if (this.finishedCallback) {
      this.finishedCallback();
    }
    for (let i = 0; i < buffer.objects.length; i++) {
      this.meshes[i] = new Mesh(this.renderer);
      this.meshes[i].setJSONData(buffer.objects[i]);
    }
  }
}
