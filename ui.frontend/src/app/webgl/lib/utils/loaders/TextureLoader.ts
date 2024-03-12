import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import Renderer from '../../renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import TextureFormat from '../../renderer/texture/TextureFormat';
import Texture2D from '../../renderer/texture/Texture2D';
import LoadUtils from 'mediamonks-webgl/renderer/core/LoadUtils';

export default class TextureLoader extends Texture2D implements IWebGLPreloadable {
  public loaded: boolean = false;
  public image!: HTMLImageElement;
  public storeImage: boolean = false;

  private url: string;
  private premultiply: boolean = false;

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    url: string,
    mipsEnabled: boolean = false,
    filterLinear: boolean = true,
    wrapClamp: boolean = true,
    flipY = true,
    format: string = TextureFormat.RGBA_UNSIGNED_BYTE,
    premultiply: boolean = false,
  ) {
    super(renderer, format, mipsEnabled, filterLinear, wrapClamp);
    this.flipY = flipY;
    this.url = url;
    this.name = url;
    this.premultiply = premultiply;
    preloader.add(this);
  }

  public load(callback: () => void): void {
    LoadUtils.loadImage(this.url, (image) => {
      // image.decode().then(data => {
      this.setImage(image, this.flipY, this.premultiply);
      this.loaded = true;
      if (this.storeImage) this.image = image;
      callback.call(this);
      // }).catch((encodingError) => {
      //   //can fail if the device does not have sufficient memory available
      //   console.warn(this.url, encodingError);
      //   callback.call(this);
      // })
    });
  }
}
