import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import MaterialLoader from 'mediamonks-webgl/renderer/material/MaterialLoader';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import TextureFormat from 'mediamonks-webgl/renderer/texture/TextureFormat';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import TextureLoader from 'mediamonks-webgl/utils/loaders/TextureLoader';
import Vector4 from 'mediamonks-webgl/renderer/math/Vector4';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import TextureCube from 'mediamonks-webgl/renderer/texture/TextureCube';
import { PbrConfig } from 'mediamonks-webgl/pbr/PbrConfig';
import PbrEnvironment from 'mediamonks-webgl/pbr/PbrEnvironment';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';

export interface IUnityTextureInfo {
  name: string;
  clamp: boolean;
  mipmap: boolean;
  filterLinear: boolean;
}

export default class UnityMaterial extends MaterialLoader implements IWebGLPreloadable {
  public additive: boolean = false;
  public skinned: boolean = false;

  public albedoMap: Texture2D | null = null;
  public albedoValue: Vector3 = new Vector3(1, 1, 1);

  public roughnessMap: Texture2D | null = null;
  public roughnessValue = -1;

  public metallicMap: Texture2D | null = null;
  public metallicValue = -1;

  public emissiveMap: Texture2D | null = null;
  public emissiveValue: Vector3 = new Vector3(0, 0, 0);
  public isEmissive: boolean = false;

  public normalMap: Texture2D | null = null;
  public aoMap: Texture2D | null = null;

  public alphaValue: number = 1;
  public alphaMap: Texture2D | null = null;

  public glass = false;
  public transparent: boolean = false;

  public useUV1ForAOMap = false;
  public unlit = false;
  private _lodSupported: boolean;
  public uniforms: { name: string; value: number[] }[] = [];

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    materialInfo: any,
    texturePool: { [url: string]: Texture2D },
    textureInfoByName: { [name: string]: IUnityTextureInfo },
    getTextureURL: ((name: string, noCompression: boolean) => string) | null = null,
  ) {
    super(renderer, preloader, 'uber');

    //if (LogGL.ENABLED) console.log(materialInfo.name, materialInfo);

    this.name = materialInfo.name;

    if (materialInfo.shaderName.indexOf('Unlit') >= 0) this.unlit = true;
    if (materialInfo.shaderName.indexOf('Skinned') >= 0) this.skinned = true;

    if (LogGL.ENABLED) this.addShaderDefines('DEBUG_ENABLED');

    if (!PbrConfig.useBRDFLut) this.addShaderDefines('NO_BDRF_LUT');

    if (!PbrConfig.useFloatTextures) {
      this.addShaderDefines('LDR_MAPS');
    }
    if (!renderer.extensionManager.shader_texture_lod) {
      this.addShaderDefines('NO_LOD_EXTENSION');
      this._lodSupported = false;
    } else {
      this._lodSupported = true;
    }

    // this.setCullingBackFace();
    // this.setCullingFrontFace();
    this.setCullingDisabled();

    for (let property of materialInfo.properties) {
      switch (property.name) {
        case '_MainTex':
          this.addShaderDefines('USE_ALBEDO_MAP');
          this.albedoMap = this.getTexture(
            property.sValue,
            preloader,
            3,
            texturePool,
            getTextureURL,
          );
          this.uniforms.push({
            name: '_MainTex_ST',
            value: [property.vValue[0], property.vValue[1], property.vValue[2], property.vValue[3]],
          });
          break;
        case '_Color':
          this.albedoValue.setValues(property.vValue[0], property.vValue[1], property.vValue[2]);
          break;
        case '_Alpha':
          this.addShaderDefines('TRANSPARENT');
          this.transparent = true;
          this.alphaValue = property.vValue[0];
          break;
        case '_AlphaMap':
          this.addShaderDefines('TRANSPARENT');
          this.addShaderDefines('USE_ALPHA_MAP');
          this.transparent = true;
          this.alphaMap = this.getTexture(
            property.sValue,
            preloader,
            1,
            texturePool,
            getTextureURL,
          );
          break;
        case '_RoughnessMap':
          this.addShaderDefines('USE_ROUGHNESS');
          this.addShaderDefines('USE_ROUGHNESS_MAP');
          this.roughnessMap = this.getTexture(
            property.sValue,
            preloader,
            1,
            texturePool,
            getTextureURL,
          );
          break;
        case '_Roughness':
          this.addShaderDefines('USE_ROUGHNESS');
          this.roughnessValue = property.vValue[0];
          break;
        case '_MetallicMap':
          this.addShaderDefines('USE_METALLIC_MAP');
          this.addShaderDefines('USE_METALLIC');
          this.metallicMap = this.getTexture(
            property.sValue,
            preloader,
            1,
            texturePool,
            getTextureURL,
          );
          break;
        case '_Metallic':
          this.addShaderDefines('USE_METALLIC');
          this.metallicValue = property.vValue[0];
          break;
        case '_NormalMap':
          this.addShaderDefines('USE_NORMAL_MAP');
          this.normalMap = this.getTexture(
            property.sValue,
            preloader,
            3,
            texturePool,
            getTextureURL,
          );
          break;
        case '_OcclusionMap':
          this.addShaderDefines('USE_AO_MAP');
          this.aoMap = this.getTexture(property.sValue, preloader, 1, texturePool, getTextureURL);
          break;
        case '_EmissiveMap':
          this.isEmissive = true;
          this.addShaderDefines('USE_EMISSIVE');
          this.addShaderDefines('USE_EMISSIVE_MAP');
          this.emissiveMap = this.getTexture(
            property.sValue,
            preloader,
            3,
            texturePool,
            getTextureURL,
          );
          break;
        case '_Emissive':
          this.isEmissive = true;
          this.addShaderDefines('USE_EMISSIVE');
          this.emissiveValue.setValues(property.vValue[0], property.vValue[1], property.vValue[2]);
          break;
        case '_UseUV1ForAO':
          if (property.vValue[0] > 0.5) this.addShaderDefines('USE_UV1_FOR_AO_MAP');
          this.useUV1ForAOMap = property.vValue[0] > 0.5;
          break;
        case '_IsGlass':
          this.glass = property.vValue[0] > 0.5;
          if (this.glass) this.addShaderDefines('GLASS');
          break;
        default:
          if (property.sValue == '') {
            this.uniforms.push({ name: property.name, value: property.vValue });
          } else {
            if (LogGL.ENABLED) console.warn('unhandled property', property);
          }
          break;
      }
    }

    if (this.transparent || this.glass) {
      this.setPreMultipliedAlphaBlending();
      this.setCullingDisabled();
      this.depthWrite = false;
      // }else{
      //   this.setPreMultipliedAlphaBlending();
      //   this.depthWrite = true;
    }

    if (materialInfo.shaderName == 'Webgl/UnlitMultiply') {
      this.setMultiplyBlending();
      this.setCullingDisabled();
      //this.depthTest = false;
    }

    if (this.skinned) {
      this.addShaderDefines('SKINNED_MATRICES');
    }

    if (this.unlit) {
      this.addShaderDefines('UNLIT');
    }

    this.name = materialInfo.name;
  }

  private getFormat(channelCount: number) {
    if (channelCount == 1) {
      return TextureFormat.LUMINANCE_UNSIGNED_BYTE;
    } else if (channelCount == 3) {
      return TextureFormat.RGB_UNSIGNED_BYTE;
    } else {
      return TextureFormat.RGBA_UNSIGNED_BYTE;
    }
  }

  private getTexture(
    name: string,
    preloader: WebGLPreLoader,
    channelCount: number = 3,
    texturePool: { [url: string]: Texture2D },
    texturePath: ((name: string, noCompression: boolean) => string) | null = null,
  ): Texture2D | null {
    if (!texturePool[name] && texturePath) {
      texturePool[name] = new TextureLoader(
        this.renderer,
        preloader,
        texturePath(name, channelCount == 4),
        true,
        true,
        false,
        true,
        this.getFormat(channelCount),
      );
    } else {
      if (LogGL.ENABLED) console.log('getTexture: pooled', name);
    }
    return texturePool[name];
  }

  public init() {
    this.setVector3('_Albedo', this.albedoValue);
    if (this.albedoMap) {
      this.setTexture('_AlbedoMap', this.albedoMap);
    }
    if (this.alphaMap) {
      this.setTexture('_AlphaMap', this.alphaMap);
    }

    if (!this.unlit) {
      if (this.roughnessMap) {
        this.setTexture('_RoughnessMap', this.roughnessMap);
      } else {
        this.setFloat('_Roughness', this.roughnessValue);
      }
      if (this.metallicMap) {
        this.setTexture('_MetallicMap', this.metallicMap);
      } else {
        this.setFloat('_Metallic', this.metallicValue);
      }
      if (this.isEmissive) {
        if (this.emissiveMap) {
          this.setTexture('_EmissiveMap', this.emissiveMap);
        } else {
          this.setVector3('_Emissive', this.emissiveValue);
        }
      }
      if (this.normalMap) {
        this.setTexture('_NormalMap', this.normalMap);
      }
      if (this.aoMap) {
        this.setTexture('_AOMap', this.aoMap);
      }
    }
    this.setFloatUniforms(this.uniforms, false);
  }

  public setFloatUniforms(
    floatUniforms: { name: string; value: number[] }[],
    checkChange: boolean = true,
  ) {
    for (let i = 0; i < floatUniforms.length; i++) {
      const f = floatUniforms[i];

      //change detect to prevent uniforms being set too often
      if (checkChange) {
        const fShared = this.uniforms[i];
        let changed = false;
        for (let j = 0; j < f.value.length; j++) {
          if (f.value[j] != fShared.value[j]) {
            fShared.value[j] = f.value[j];
            changed = true;
          }
        }
        if (!changed) continue;
      }

      if (f.value.length == 1) {
        this.setFloat(f.name, f.value[0]);
      } else if (f.value.length == 2) {
        this.setVector2(f.name, new Vector2(f.value[0], f.value[1]));
      } else if (f.value.length == 3) {
        this.setVector3(f.name, new Vector3(f.value[0], f.value[1], f.value[2]));
      } else if (f.value.length == 4) {
        this.setVector4(f.name, new Vector4(f.value[0], f.value[1], f.value[2], f.value[3]));
      }
    }
  }

  public setPbrEnvironment(environment: PbrEnvironment) {
    if (PbrConfig.useBRDFLut) {
      this.setTexture('_brdfLUT', environment.brdfLutTexture!);
    }

    if (
      !environment.diffuseCube ||
      !environment.specularCube ||
      environment.mipmapWithMaxRoughness === null
    ) {
      throw new Error('cannot set pbr environment: given PbrEnvironment not initialized');
    }
    this.setTexture('_IrradianceMap', environment.diffuseCube);
    this.setTexture('_PrefilterMap', environment.specularCube);
    this.setFloat('_MaxLod', environment.mipmapWithMaxRoughness);
    this.setFloat('_Gamma', 2.2);

    if (!this._lodSupported) {
      this.setTexture('_PrefilterMapMapLow', <TextureCube>environment.specularCubeLow);
    }
  }

  private boneCount: number = -1;

  public setBoneCount(boneCount: number, useTexture: boolean) {
    if (this.boneCount > 0) {
      if (boneCount != this.boneCount) {
        console.warn(
          'setBoneCount: setting different boneCounts on a material is not supported',
          boneCount,
          this.boneCount,
        );
      }
    } else {
      if (LogGL.ENABLED) console.log(this.name, 'boneCount', boneCount);
      if (boneCount > 0) {
        this.addShaderDefines(['SKINNED_MATRICES', 1]);
        this.addShaderDefines(['BONE_COUNT', boneCount]);
        //too many bones for uniforms
        if (useTexture) this.addShaderDefines(['SKINNED_MATRICES_TEXTURE', 1]);
        this.boneCount = boneCount;
      }
    }
  }

  destruct() {
    this.albedoMap?.destruct();
    this.alphaMap?.destruct();
    this.roughnessMap?.destruct();
    this.metallicMap?.destruct();
    this.emissiveMap?.destruct();
    this.normalMap?.destruct();
    this.aoMap?.destruct();
    super.destruct();
  }
}
