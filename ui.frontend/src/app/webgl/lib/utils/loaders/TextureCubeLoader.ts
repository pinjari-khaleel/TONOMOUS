import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Renderer from '../../renderer/render/Renderer';
import TextureCube from '../../renderer/texture/TextureCube';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';
import TextureFormat from 'mediamonks-webgl/renderer/texture/TextureFormat';

export default class TextureCubeLoader extends TextureCube implements IWebGLPreloadable {
  private urls: string[];

  constructor(
    renderer: Renderer,
    WebGLPreLoader: WebGLPreLoader,
    urls: string[],
    mips: boolean,
    flipZ: boolean = false,
    flipY: boolean = true,
  ) {
    super(renderer, TextureFormat.RGBA_UNSIGNED_BYTE, mips, true, true, flipZ, flipY);
    this.urls = [...urls];
    WebGLPreLoader.add(this);
  }

  public load(callback: () => void): void {
    LoadUtils.loadMultipleImages(this.urls, (images: HTMLImageElement[]) => {
      this.setImages(images);
      callback.call(this);
    });
  }
}
