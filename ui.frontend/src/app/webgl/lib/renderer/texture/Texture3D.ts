import GL from '../base/GL';
import GL2 from '../base/GL2';
import RendererWebGL2 from '../render/RendererWebGL2';
import Texture from './Texture';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';

export default class Texture3D extends Texture {
  private _size: Vector3 = new Vector3();

  // format should be chosen from Texture3DFormat
  constructor(
    renderer: RendererWebGL2,
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    format: number,
    useMips: boolean = false,
    filterLinear: boolean = true,
    clampToEdge: boolean = true,
  ) {
    super(renderer, GL2.TEXTURE_3D, useMips, filterLinear, clampToEdge);

    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.renderer.context;
    this.bind();

    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, 0);

    this.createBuffer(sizeX, sizeY, sizeZ, format, null);
  }

  get width(): number {
    return this._size.x;
  }

  get height(): number {
    return this._size.y;
  }

  get depth(): number {
    return this._size.z;
  }

  private createBuffer(
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    internalformat: number,
    data: ArrayBufferView | null = null,
  ) {
    this._size.setValues(sizeX, sizeY, sizeZ);
    this._format = internalformat;

    const gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.renderer.context;

    let format = -1;
    let type = -1;

    // TODO: handle additional formats
    switch (internalformat) {
      case GL2.R8:
        format = GL2.RED;
        type = GL.UNSIGNED_BYTE;
        break;
      case GL2.RGB8:
        format = GL.RGB;
        type = GL.UNSIGNED_BYTE;
        break;
      case GL2.RGBA8:
        format = GL.RGBA;
        type = GL.UNSIGNED_BYTE;
        break;
      case GL2.R32F:
        format = GL2.RED;
        type = GL.FLOAT;
        break;
      case GL2.RGB32F:
        format = GL.RGB;
        type = GL.FLOAT;
        break;
      case GL2.RGBA32F:
        format = GL.RGBA;
        type = GL.FLOAT;
        break;
      default:
        console.log('Texture3D: internal-format not handled', internalformat);
        return;
    }

    this._format = format;
    this._type = type;
    this._internalFormat = internalformat;

    gl.texImage3D(
      gl.TEXTURE_3D, // target
      0, // level
      internalformat, // internalformat
      sizeX, // width
      sizeY, // height
      sizeZ, // depth
      0, // border
      format, // format
      type, // type
      data, // pixel
    );

    this.mipsDirty = true;
    this.generateMipsIfNeeded();
  }
}
