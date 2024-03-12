import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Texture2D from '../../renderer/texture/Texture2D';
import TextureFormat from '../../renderer/texture/TextureFormat';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';
import HDRImageParser from '../image/HDRImageParser';

export default class HDRTextureLoader extends Texture2D implements IWebGLPreloadable {
  private path: string;
  private convertToLDR: boolean;

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    file: string,
    convertToLDR: boolean = false,
  ) {
    super(renderer, convertToLDR ? TextureFormat.RGBA_UNSIGNED_BYTE : TextureFormat.RGB_FLOAT);
    this.path = file;
    this.convertToLDR = convertToLDR;
    preloader.add(this);
  }

  public load(callback: () => void): void {
    LoadUtils.loadArrayBuffer(this.path, (data: ArrayBuffer) => {
      const result = HDRImageParser.parse(new Uint8Array(data), this.convertToLDR);
      if (result) {
        this.setData(result.data, result.width, result.height, true);
      }
      callback.call(this);
    });
  }
}
