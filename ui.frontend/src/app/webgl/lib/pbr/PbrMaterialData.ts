import TextureLoader from '../utils/loaders/TextureLoader';
import WebGLPreLoader from '../renderer/core/WebGLPreLoader';
import Renderer from '../renderer/render/Renderer';
import Vector3 from '../renderer/math/Vector3';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import IWebGLDestructible from '../renderer/core/IWebGLDestructible';

export type DataInfo = {
  albedoMap?: string;
  albedoValue?: Vector3 | Array<number>;

  roughnessMap?: string;
  roughnessValue?: number;

  metallicMap?: string;
  metallicValue?: number;

  emissiveMap?: string;
  emissiveValue?: Vector3 | Array<number>;

  normalMap?: string;
  aoMap?: string;

  useUV1ForAOMap?: boolean;

  glass?: boolean;
  transparent?: boolean;

  uv0Scale?: number;
  useSharedAOMap?: boolean;
};

export default class PbrMaterialData implements IWebGLDestructible {
  public albedoMap: Texture2D | null = null;
  public albedoValue: Vector3 | null = null;

  public roughnessMap: Texture2D | null = null;
  public roughnessValue = -1;

  public metallicMap: Texture2D | null = null;
  public metallicValue = -1;

  public emissiveMap: Texture2D | null = null;
  public emissiveValue: Vector3 | null = null;

  public normalMap: Texture2D | null = null;
  public aoMap: Texture2D | null = null;

  public uv1ForAOMap = false;

  public glass = false;
  public transparent = false;

  public uv0Scale = -1;
  public sharedAOMap = false;

  constructor(renderer: Renderer, preloader: WebGLPreLoader | null, data: DataInfo) {
    if (data.albedoMap && preloader) {
      this.albedoMap = new TextureLoader(renderer, preloader, data.albedoMap, true, true, false);
    }

    if (data.albedoValue) {
      if (data.albedoValue instanceof Array) {
        this.albedoValue = new Vector3(
          data.albedoValue[0],
          data.albedoValue[1],
          data.albedoValue[2],
        );
      } else {
        this.albedoValue = <Vector3>data.albedoValue;
      }
    }

    if (this.albedoMap === null && this.albedoValue === null) {
      console.error('Pbr needs at least an albedo map or an albedo value');
    }

    if (data.roughnessMap && preloader) {
      this.roughnessMap = new TextureLoader(
        renderer,
        preloader,
        data.roughnessMap,
        true,
        true,
        false,
      );
    }
    if (typeof data.roughnessValue === 'number') {
      this.roughnessValue = data.roughnessValue;
    }

    if (data.metallicMap && preloader) {
      this.metallicMap = new TextureLoader(
        renderer,
        preloader,
        data.metallicMap,
        true,
        true,
        false,
      );
    }
    if (typeof data.metallicValue === 'number') {
      this.metallicValue = data.metallicValue;
    }

    if (data.emissiveMap && preloader) {
      this.emissiveMap = new TextureLoader(
        renderer,
        preloader,
        data.emissiveMap,
        true,
        true,
        false,
      );
    }
    if (data.emissiveValue) {
      if (data.emissiveValue instanceof Array) {
        this.emissiveValue = new Vector3(
          data.emissiveValue[0],
          data.emissiveValue[1],
          data.emissiveValue[2],
        );
      } else {
        this.emissiveValue = <Vector3>data.emissiveValue;
      }
    }

    if (data.normalMap && preloader) {
      this.normalMap = new TextureLoader(renderer, preloader, data.normalMap, true, true, false);
    }
    if (data.aoMap && preloader) {
      this.aoMap = new TextureLoader(renderer, preloader, data.aoMap, true, true, false);
    }

    if (data.useUV1ForAOMap) {
      this.uv1ForAOMap = data.useUV1ForAOMap;
    }

    if (data.glass) {
      this.glass = data.glass;
    }
    if (data.transparent) {
      this.transparent = data.transparent;
    }

    if (typeof data.uv0Scale === 'number' && data.uv0Scale !== 1) {
      this.uv0Scale = data.uv0Scale;
    }
    if (data.useSharedAOMap) {
      this.sharedAOMap = data.useSharedAOMap;
    }
  }

  public useRoughness(): boolean {
    return this.roughnessMap !== null || this.roughnessValue >= 0;
  }

  public useMetallic(): boolean {
    return this.metallicMap !== null || this.metallicValue >= 0;
  }

  public useEmissive(): boolean {
    return this.emissiveMap !== null || this.emissiveValue !== null;
  }

  public useAlbedoValue(): boolean {
    return this.albedoValue !== null;
  }

  public useRoughnessValue(): boolean {
    return this.roughnessValue >= 0;
  }

  public useMetallicValue(): boolean {
    return this.metallicValue >= 0;
  }

  public useEmissiveValue(): boolean {
    return this.emissiveValue !== null;
  }

  public useNormalMap(): boolean {
    return this.normalMap !== null;
  }

  public useAOMap(): boolean {
    return this.sharedAOMap || this.aoMap !== null;
  }

  public useUV1ForAOMap(): boolean {
    return this.uv1ForAOMap;
  }

  public isTransparent(): boolean {
    return this.transparent;
  }

  public isGlass(): boolean {
    return this.glass;
  }

  public scaleUV0(): boolean {
    return this.uv0Scale >= 0;
  }

  public destruct(): void {}
}
