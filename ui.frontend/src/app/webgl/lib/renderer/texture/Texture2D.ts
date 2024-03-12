import Renderer from '../render/Renderer';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import GL from '../base/GL';
import Vector2 from '../math/Vector2';
import Texture from './Texture';
import TextureFormat from './TextureFormat';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import TextureUtils from 'mediamonks-webgl/renderer/core/TextureUtils';
import GL2 from 'mediamonks-webgl/renderer/base/GL2';

export default class Texture2D extends Texture {
  private _size: Vector2 = new Vector2(-1, -1);

  public static textureBytesLoaded = 0;
  private static framebuffers: { [rendererID: number]: WebGLFramebuffer | null } = {};

  constructor(
    renderer: Renderer,
    formatType: string = TextureFormat.RGBA_UNSIGNED_BYTE,
    useMips: boolean = false,
    filterLinear: boolean = true,
    clampToEdge: boolean = true,
  ) {
    super(renderer, GL.TEXTURE_2D, useMips, filterLinear, clampToEdge);

    this._formatType = renderer.isWebgl2
      ? formatType
      : TextureFormat.validateFormatType(renderer, formatType);
    this._format = TextureFormat.getFormat(this.renderer, this.formatType);
    this._type = TextureFormat.getType(this.renderer, this.formatType);
    this._internalFormat = renderer.isWebgl2
      ? TextureFormat.getInternalFormat(formatType)
      : this._format;
  }

  public get width(): number {
    return this._size.x;
  }

  public get height(): number {
    return this._size.y;
  }

  public get size(): Vector2 {
    return this._size.clone();
  }

  public get aspectRatio(): number {
    return this.width / this.height;
  }

  public setSize(width: number, height: number): void {
    if (width === this.width && height === this.height) {
      return;
    }
    this._size.setValues(width, height);
    this.bind();

    if (this.renderer.isWebgl2) {
      this.renderer.context.texImage2D(
        GL.TEXTURE_2D,
        0,
        this._internalFormat,
        this.width,
        this.height,
        0,
        this.format,
        this.type,
        null,
      );
    } else {
      this.renderer.context.texImage2D(
        GL.TEXTURE_2D,
        0,
        this.format,
        this.width,
        this.height,
        0,
        this.format,
        this.type,
        null,
      );
    }
    LogGL.log('expensive operation: resize: ', width, height, 'format: ', this.format);

    this.mipsDirty = true;
  }

  protected generateMipsIfNeeded(): void {
    if (this.useMips) {
      if (
        !this.renderer.isWebgl2 &&
        !(Utils.isPowerOfTwo(this.width) && Utils.isPowerOfTwo(this.height))
      ) {
        LogGL.error("can't generate mips: npot: ", this.width, this.height);
        this.useMips = false;
      } else {
        super.generateMipsIfNeeded();
      }
    }
  }

  public setData(
    data: ArrayBufferView,
    width: number,
    height: number,
    flipY: boolean = this.flipY,
  ) {
    this.flipY = flipY;
    const gl = this.renderer.context;
    this.bind();

    gl.pixelStorei(GL.UNPACK_ALIGNMENT, this.unpackAlignment);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
    gl.pixelStorei(GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, GL.NONE);

    if (this.renderer.isWebgl2) {
      (<WebGL2RenderingContext>gl).texImage2D(
        GL.TEXTURE_2D,
        0,
        this._internalFormat,
        width,
        height,
        0,
        this.format,
        this.type,
        data,
      );
    } else {
      (<WebGLRenderingContext>gl).texImage2D(
        GL.TEXTURE_2D,
        0,
        this.format,
        width,
        height,
        0,
        this.format,
        this.type,
        data,
      );
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    this._size.setValues(width, height);

    this.mipsDirty = true;
    this.generateMipsIfNeeded();
  }

  public getData(framebuffer: WebGLFramebuffer | null = null): Float32Array | Uint8Array {
    const gl: WebGLRenderingContext = this.renderer.context;

    if (!framebuffer) {
      framebuffer = Texture2D.getFramebuffer(this.renderer);
    }

    gl.bindFramebuffer(GL.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.textureGL, 0);

    let data;
    switch (this.formatType) {
      case TextureFormat.RGBA_FLOAT:
        data = new Float32Array(this.width * this.height * 4);
        break;
      case TextureFormat.RGB_FLOAT:
        data = new Float32Array(this.width * this.height * 3);
        break;
      case TextureFormat.RGBA_UNSIGNED_BYTE:
        data = new Uint8Array(this.width * this.height * 4);
        break;
      case TextureFormat.RGB_UNSIGNED_BYTE:
        data = new Uint8Array(this.width * this.height * 3);
        break;
      case TextureFormat.LUMINANCE_UNSIGNED_BYTE:
        data = new Uint8Array(this.width * this.height);
        break;
      default:
        throw new Error('can not yet get data for format type: ' + this.formatType);
    }
    gl.readPixels(0, 0, this.width, this.height, this.format, this.type, data);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return data;
  }

  public getUint8Data(framebuffer: WebGLFramebuffer | null = null) {
    return this.getData(framebuffer) as Uint8Array;
  }

  // slow operation:avoid
  public getPixel(x: number, y: number): Uint8Array {
    const gl: WebGLRenderingContext = this.renderer.context;
    const framebuffer = Texture2D.getFramebuffer(this.renderer);
    gl.bindFramebuffer(GL.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.textureGL, 0);

    const data = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, data);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return data;
  }

  private static getFramebuffer(renderer: Renderer): WebGLFramebuffer {
    if (!Texture2D.framebuffers[renderer.id]) {
      Texture2D.framebuffers[renderer.id] = <WebGLBuffer>renderer.context.createFramebuffer();
    }
    return <WebGLFramebuffer>Texture2D.framebuffers[renderer.id];
  }

  public get channelCount(): number {
    switch (this.format) {
      case GL.RGBA:
        return 4;
      case GL.RGB:
        return 3;
      case GL2.RG:
        return 2;
      case GL.LUMINANCE:
        return 1;
      case GL2.RED:
        return 1;
      default:
        if (LogGL.ENABLED) console.warn('unhandled format', this.format);
        return 4;
    }
  }

  // note: the image determines the size of the texture
  public setImage(
    image: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
    flipY: boolean = true,
    premultiply: boolean = false,
  ) {
    if (this.isDestructed) {
      return;
    }
    const size = TextureUtils.getSize(image);

    if (
      this.useMips &&
      !this.renderer.isWebgl2 &&
      !(Utils.isPowerOfTwo(size.x) && Utils.isPowerOfTwo(size.y)) &&
      !(image instanceof ImageData)
    ) {
      const newWidth =
        size.x > 500 ? Utils.nearestPowerOfTwo(size.x) : Utils.nextPowerOfTwo(size.x);
      const newHeight =
        size.y > 500 ? Utils.nearestPowerOfTwo(size.y) : Utils.nextPowerOfTwo(size.y);
      console.warn(
        'Expensive operation: setImage - resize image to dimensions of power of two ' +
          newWidth +
          ', ' +
          newHeight,
      );
      image = TextureUtils.resizeImage(image, newWidth, newHeight);
    }

    this.flipY = flipY;
    const gl: WebGLRenderingContext = this.renderer.context;
    this.bind();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
    gl.pixelStorei(GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, GL.NONE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply ? 1 : 0);
    gl.texImage2D(GL.TEXTURE_2D, 0, this._internalFormat, this.format, this.type, <ImageData>image);

    this._size.copy(TextureUtils.getSize(image));

    if (!(image instanceof HTMLVideoElement)) {
      Texture2D.textureBytesLoaded +=
        this.width * this.height * TextureFormat.getBytesPerPixel(this.formatType);
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

    this.mipsDirty = true;
    this.generateMipsIfNeeded();
  }

  public static logImageTextureMemoryUsage() {
    LogGL.log('ImageTextureMemoryUsage: ' + Texture2D.textureBytesLoaded / (1024 * 1024) + ' MB');
  }

  destruct() {
    if (Texture2D.framebuffers[this.renderer.id]) {
      const gl: WebGLRenderingContext = this.renderer.context;
      gl.deleteFramebuffer(Texture2D.framebuffers[this.renderer.id]);
      Texture2D.framebuffers[this.renderer.id] = null;
    }
    super.destruct();
  }
}
