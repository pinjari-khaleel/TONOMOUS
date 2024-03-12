import WebGLPreLoader from '../renderer/core/WebGLPreLoader';
import Renderer from '../renderer/render/Renderer';
import TextureCube from '../renderer/texture/TextureCube';
import TextureLoader from '../utils/loaders/TextureLoader';
import TextureFormat from '../renderer/texture/TextureFormat';
import ImageLoader from '../utils/loaders/ImageLoader';
import LogGL from '../renderer/core/LogGL';
import { PbrConfig } from './PbrConfig';
import imgBrdFlut from './img/brdflut.png';
import IWebGLDestructible from '../renderer/core/IWebGLDestructible';
import ImageUtils from '../utils/image/ImageUtils';
import RenderTexture from '../renderer/texture/RenderTexture';
import Texture2D from '../renderer/texture/Texture2D';
import MaterialLoader from '../renderer/material/MaterialLoader';

const shadersWebpackContext = require.context('./shaders', true, /\.glsl$/);

export default class PbrEnvironment implements IWebGLDestructible {
  private _renderer: Renderer;

  public diffuseCube!: TextureCube;
  public specularCube!: TextureCube;
  public specularCubeLow!: TextureCube;

  private _diffuseImageLoader: ImageLoader;
  private _specularImageLoader: ImageLoader;

  public mipmapWithMaxRoughness!: number;
  public brdfLutTexture: TextureLoader | undefined;

  public static instanceExists: boolean = false;

  private useShaderForConversion: boolean;

  private hdrToFloatRenderTarget: RenderTexture | undefined;
  private tempTexture: Texture2D | undefined;
  private hdrToFloatMaterial: MaterialLoader | undefined;

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    getTextureURL: (name: string) => string,
  ) {
    PbrEnvironment.instanceExists = true;

    this._renderer = renderer;
    renderer.shaderIndex.addContext(shadersWebpackContext);

    this.useShaderForConversion =
      PbrConfig.useShaderForHdrToFloatConversion && PbrConfig.useFloatTextures;

    this._diffuseImageLoader = new ImageLoader(
      preloader,
      getTextureURL(`./${PbrConfig.useFloatTextures ? '' : 'ldr_'}diffuse.png`),
    );
    this._specularImageLoader = new ImageLoader(
      preloader,
      getTextureURL(`./${PbrConfig.useFloatTextures ? '' : 'ldr_'}specular.png`),
    );

    if (PbrConfig.useBRDFLut) {
      this.brdfLutTexture = new TextureLoader(this._renderer, preloader, imgBrdFlut, false, true);
    }
    if (this.useShaderForConversion) {
      this.hdrToFloatMaterial = new MaterialLoader(this._renderer, preloader, 'hdrtofloat');
    }

    LogGL.log('PBR useFloatTextures: ' + PbrConfig.useFloatTextures);
    LogGL.log('PBR useShaderForHdrToFloatConversion: ' + this.useShaderForConversion);
    LogGL.log('PBR brdf LUT: ' + PbrConfig.useBRDFLut);
    LogGL.log('PBR EXT_shader_texture_lod: ' + renderer.extensionManager.shader_texture_lod);
  }

  public init(): void {
    const diffuse = ImageUtils.getImageData(this._diffuseImageLoader.image, true);
    const specular = ImageUtils.getImageData(this._specularImageLoader.image, true);

    this.createCubeMaps(
      {
        data: new Uint8Array(diffuse.data),
        width: diffuse.width,
        height: diffuse.height,
      },
      {
        data: new Uint8Array(specular.data),
        width: specular.width,
        height: specular.height,
      },
    );
  }

  private createCubeMaps(
    diffuse: { data: Uint8Array; width: number; height: number },
    specular: { data: Uint8Array; width: number; height: number },
  ) {
    // create cubeMaps, first map 'hdr png to float'
    let data: Float32Array | Uint8Array;
    let createMips = this._renderer.extensionManager.shader_texture_lod != null;
    createMips = createMips || this._renderer.isWebgl2;
    console.log('PbrEnvironment: createMips', createMips);

    if (PbrConfig.useFloatTextures) {
      data = <Float32Array>(
        this.getDecodedDataFromImageData(diffuse.data, diffuse.width, diffuse.height)
      );
    } else {
      data = <Uint8Array>(
        this.getDecodedDataFromImageData(diffuse.data, diffuse.width, diffuse.height)
      );
    }

    // fill diffuse cubemap
    this.diffuseCube = this.createCube(data, diffuse.width, diffuse.height, false);

    if (PbrConfig.useFloatTextures) {
      data = <Float32Array>(
        this.getDecodedDataFromImageData(specular.data, specular.width, specular.height)
      );
    } else {
      data = <Uint8Array>(
        this.getDecodedDataFromImageData(specular.data, specular.width, specular.height)
      );
    }

    this.specularCube = this.createCube(data, specular.width, specular.height, createMips);

    if (!createMips) {
      let width = specular.width;
      let offset = 0;
      offset += width * width * 4 * 6;
      width /= 2;

      const subdata = data.subarray(offset);
      this.specularCubeLow = this.createCube(subdata, width, width, createMips);
    }

    const nummipmaps = Math.floor(Math.log(specular.width) / Math.log(2));
    this.mipmapWithMaxRoughness = nummipmaps - 4;
  }

  private createCubes(diffuse: ImageData, specular: ImageData) {}

  //set data generated from: PbrPrecompute via drag and drop
  public setPrecomputedImages(mapsData: Uint8Array[]) {
    console.log('PbrEnvironment: setDatas', mapsData);

    const diffuseData = PbrConfig.useFloatTextures ? mapsData[2] : mapsData[3];
    const diffuse_l = diffuseData.length / 4;
    const diffuse_w = Math.sqrt(diffuse_l / 6);
    const diffuse_h = diffuse_w * 6;

    const specularData = PbrConfig.useFloatTextures ? mapsData[0] : mapsData[1];
    const specular_l = specularData.length / 4;
    const specular_w = Math.sqrt(specular_l / 8);
    const specular_h = specular_w * 8;

    this.createCubeMaps(
      {
        data: diffuseData,
        width: diffuse_w,
        height: diffuse_h,
      },
      {
        data: specularData,
        width: specular_w,
        height: specular_h,
      },
    );
  }

  private getDecodedDataFromImageData(data: Uint8Array, width: number, height: number) {
    if (PbrConfig.useFloatTextures) {
      // HDR conversions

      if (this.useShaderForConversion) {
        if (!this.hdrToFloatRenderTarget) {
          this.hdrToFloatRenderTarget = new RenderTexture(
            this._renderer,
            width,
            height,
            TextureFormat.RGBA_FLOAT,
          );
        }
        if (!this.tempTexture) {
          this.tempTexture = new Texture2D(this._renderer);
        }

        this.hdrToFloatRenderTarget.setSize(width, height);
        this.tempTexture.setData(data, width, height);

        this._renderer.blit(this.tempTexture, this.hdrToFloatRenderTarget, this.hdrToFloatMaterial);

        return this.hdrToFloatRenderTarget.getData();
      } else {
        const floatData = new Float32Array(width * height * 4);
        let offset = 0;
        for (let i = 0; i < data.byteLength; i += 4) {
          const e = Math.pow(2, data[i + 3] - 128) / 255;
          floatData[offset++] = data[i + 0] * e;
          floatData[offset++] = data[i + 1] * e;
          floatData[offset++] = data[i + 2] * e;
          floatData[offset++] = 1;
        }
        return floatData;
      }
    } else {
      return data;
    }
  }

  public createCube(
    data: any,
    sourceWidth: number,
    sourceHeight: number,
    createMips: boolean,
  ): TextureCube {
    const context = this._renderer.context;
    const pixels = <Float32Array>data;

    const cubemap: TextureCube = new TextureCube(
      this._renderer,
      TextureFormat.RGBA_UNSIGNED_BYTE,
      createMips,
    );
    cubemap.autoGenerateMips = false;

    const faces: number[] = [
      context.TEXTURE_CUBE_MAP_POSITIVE_X,
      context.TEXTURE_CUBE_MAP_NEGATIVE_X,
      context.TEXTURE_CUBE_MAP_POSITIVE_Y,
      context.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      context.TEXTURE_CUBE_MAP_POSITIVE_Z,
      context.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];

    let mipmap = 0;
    let width = sourceWidth;
    let offset = 0;
    const type = PbrConfig.useFloatTextures ? context.FLOAT : context.UNSIGNED_BYTE;

    // context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 0);

    if (createMips) {
      while (width >= 1) {
        for (let face: number = 0; face < 6; ++face) {
          cubemap.bind();
          const subdata = pixels.subarray(offset);
          //   context.texSubImage2D(faces[face], mipmap, 0, 0, width, width, context.RGBA, type, subdata);
          (<WebGLRenderingContext>context).texImage2D(
            faces[face],
            mipmap,
            context.RGBA,
            width,
            width,
            0,
            context.RGBA,
            type,
            subdata,
          );
          offset += width * width * 4;
        }
        width /= 2;
        mipmap++;
      }
    } else {
      for (let face: number = 0; face < 6; ++face) {
        cubemap.bind();
        const subdata = pixels.subarray(offset);
        //    context.texSubImage2D(faces[face], mipmap, 0, 0, width, width, context.RGBA, type, subdata);
        (<WebGLRenderingContext>context).texImage2D(
          faces[face],
          0,
          context.RGBA,
          width,
          width,
          0,
          context.RGBA,
          type,
          subdata,
        );

        offset += width * width * 4;
      }
    }

    return cubemap;
  }

  public destruct(): void {}
}
