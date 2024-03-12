import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import LogGL from '../../renderer/core/LogGL';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';
import ObjParser from '../mesh/ObjParser';

export default class MeshObjLoader extends Mesh implements IWebGLPreloadable {
  private _url: string;
  private _storeData: boolean;

  constructor(
    renderer: Renderer,
    WebGLPreLoader: WebGLPreLoader,
    url: string,
    storeData: boolean = false,
  ) {
    super(renderer);
    this._url = url;
    this._storeData = storeData;
    if (url != '') {
      WebGLPreLoader.add(this);
    }
  }

  public load(callback: () => void): void {
    LoadUtils.loadText(this._url, (text: string) => {
      //LogGL.log("MeshObjLoader: load: " + text);
      var obj: ObjParser = new ObjParser();
      obj.parse(this.renderer, text, false);
      this.setOBJ(obj);
      callback.call(this);
    });
  }

  public setOBJ(obj: ObjParser): void {
    if (!obj.positions || !obj.uvs || !obj.normals) {
      throw new ReferenceError('must run parse() first on ObjParser');
    }
    LogGL.log('MeshObjLoader: setOBJ: ' + obj.positions.length, obj.uvs.length, obj.normals.length);
    this.setPositions(obj.positions, this._storeData);
    if (obj.uvs.length > 0) {
      this.setUV0(obj.uvs, this._storeData);
    }
    if (obj.normals.length > 0) {
      this.setNormals(obj.normals, this._storeData);
    }
  }
}
