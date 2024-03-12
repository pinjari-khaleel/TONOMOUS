import Renderer from '../render/Renderer';
import GL from '../base/GL';
import Texture from './Texture';
import TextureFormat from './TextureFormat';
import RendererWebGL1 from 'mediamonks-webgl/renderer/render/RendererWebGL1';
import RendererWebGL2 from 'mediamonks-webgl/renderer/render/RendererWebGL2';
import TextureUtils from 'mediamonks-webgl/renderer/core/TextureUtils';

export default class TextureCube extends Texture {
  public flipZ: boolean = false;
  private _size: number = -1;

  // use flipZ if you use images based on a left-handed coordinate system
  constructor(
    renderer: Renderer,
    formatType: string = TextureFormat.RGBA_UNSIGNED_BYTE,
    useMips: boolean = false,
    filterLinear: boolean = true,
    clampToEdge: boolean = true,
    flipZ: boolean = false,
    flipY: boolean = false,
  ) {
    super(renderer, GL.TEXTURE_CUBE_MAP, useMips, filterLinear, clampToEdge);

    this.flipZ = flipZ;
    this.flipY = flipY;

    this._formatType = renderer.isWebgl2
      ? formatType
      : TextureFormat.validateFormatType(renderer, formatType);
    this._format = TextureFormat.getFormat(this.renderer, this.formatType);
    this._type = TextureFormat.getType(this.renderer, this.formatType);
    this._internalFormat = renderer.isWebgl2
      ? TextureFormat.getInternalFormat(formatType)
      : this._format;
  }

  public get size(): number {
    return this._size;
  }

  public setSize(size: number): void {
    if (size === this._size) {
      return;
    }
    this._size = size;
  }

  public setImage(
    image: HTMLImageElement | HTMLCanvasElement,
    face: number,
    mipmapLevel: number = 0,
  ): void {
    const images = [];
    images[face] = image;
    this.setImages(images, mipmapLevel);
  }

  public setImages(
    images: (HTMLImageElement | HTMLCanvasElement)[],
    mipmapLevel: number = 0,
  ): void {
    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        this.checkSize(images[i].width);
      }
    }

    const gl = <WebGLRenderingContext>this.renderer.context;

    this.bind();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY ? 1 : 0);

    const faces: number[] = [
      GL.TEXTURE_CUBE_MAP_POSITIVE_X,
      GL.TEXTURE_CUBE_MAP_NEGATIVE_X,
      GL.TEXTURE_CUBE_MAP_POSITIVE_Y,
      GL.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      GL.TEXTURE_CUBE_MAP_POSITIVE_Z,
      GL.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];

    gl.pixelStorei(GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, GL.NONE);
    images.forEach((image, i) => {
      if (i < 6 && image) {
        let face = faces[i];
        if (this.flipZ) {
          const flipped =
            i === 2 || i === 3 ? TextureUtils.flipY(image) : TextureUtils.flipX(image);
          if (face === GL.TEXTURE_CUBE_MAP_POSITIVE_Z) {
            face = GL.TEXTURE_CUBE_MAP_NEGATIVE_Z;
          } else if (face === GL.TEXTURE_CUBE_MAP_NEGATIVE_Z) {
            face = GL.TEXTURE_CUBE_MAP_POSITIVE_Z;
          }
          gl.texImage2D(face, mipmapLevel, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, flipped);
        } else {
          gl.texImage2D(face, mipmapLevel, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
        }
      }
    });

    if (mipmapLevel === 0 && this.autoGenerateMips) {
      // NOTE(Joey): only generate mipmaps if no custom mipmap levels
      // are specified
      this.mipsDirty = true;
      this.generateMipsIfNeeded();
    }
  }

  public setData(
    face: number,
    data: ArrayBufferView,
    width: number,
    height: number,
    flipY: boolean = this.flipY,
  ) {
    this.checkSize(width);

    const gl = this.renderer.context;
    this.bind();

    gl.pixelStorei(GL.UNPACK_ALIGNMENT, this.unpackAlignment);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
    gl.pixelStorei(GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, GL.NONE);

    if (this.renderer instanceof RendererWebGL1) {
      (<WebGLRenderingContext>gl).texImage2D(
        GL.TEXTURE_CUBE_MAP_POSITIVE_X + face,
        0,
        this.format,
        width,
        height,
        0,
        this.format,
        this.type,
        data,
      );
    } else if (this.renderer instanceof RendererWebGL2) {
      (<WebGL2RenderingContext>gl).texImage2D(
        GL.TEXTURE_CUBE_MAP_POSITIVE_X + face,
        0,
        this.internalFormat,
        width,
        height,
        0,
        this.format,
        this.type,
        data,
      );
    }

    this.mipsDirty = true;
    this.generateMipsIfNeeded();
  }

  private checkSize(size: number) {
    if (size !== this._size) {
      // resize whole cubemap
      this.initTextures(size);
    }
    this.setSize(size);
  }

  public initTextures(res: number = 256): void {
    this.setSize(res);
    const dummyData = TextureUtils.createDummyImage(res, res);
    this.setImages([dummyData, dummyData, dummyData, dummyData, dummyData, dummyData]);
  }
}
