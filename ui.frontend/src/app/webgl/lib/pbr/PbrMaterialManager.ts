import WebGLPreLoader from '../renderer/core/WebGLPreLoader';
import Renderer from '../renderer/render/Renderer';
import PbrMaterialData from './PbrMaterialData';
import PbrMaterial from './PbrMaterial';
import LogGL from '../renderer/core/LogGL';
import IWebGLDestructible from '../renderer/core/IWebGLDestructible';

enum PbrMaterialType {
  USE_ROUGHNESS,
  USE_METALLIC,
  USE_EMISSIVE,
  USE_ALBEDO_VALUE,
  USE_ROUGHNESS_VALUE,
  USE_METALLIC_VALUE,
  USE_EMISSIVE_VALUE,
  USE_NORMAL_MAP,
  USE_AO_MAP,
  USE_UV1_FOR_AO_MAP,
  TRANSPARENT,
  GLASS,
  SCALE_UV0,
  SKINNED_MATRICES,
}

export default class PbrMaterialManager implements IWebGLDestructible {
  private cachedMaterials: PbrMaterial[] = [];
  private initializedMaterials: PbrMaterial[] = [];
  private customShader: string | null = null;

  public getMaterialForData(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    data: PbrMaterialData,
    skinned: boolean = false,
    shareSameMaterials: boolean = true,
    customShader: string | null = null,
  ): PbrMaterial {
    const id = this.getMaterialIdForData(data, skinned);

    //custom shaders are not cached
    if (shareSameMaterials && this.cachedMaterials[id] && customShader == null) {
      return this.cachedMaterials[id];
    }

    // create material
    const material = new PbrMaterial(renderer, preloader, customShader || this.customShader);

    if (data.useRoughness()) {
      material.addShaderDefines('USE_ROUGHNESS');
    }
    if (data.useMetallic()) {
      material.addShaderDefines('USE_METALLIC');
    }
    if (data.useEmissive()) {
      material.addShaderDefines('USE_EMISSIVE');
    }
    if (data.useAlbedoValue()) {
      material.addShaderDefines('USE_ALBEDO_VALUE');
    }
    if (data.useRoughnessValue()) {
      material.addShaderDefines('USE_ROUGHNESS_VALUE');
    }
    if (data.useMetallicValue()) {
      material.addShaderDefines('USE_METALLIC_VALUE');
    }
    if (data.useEmissiveValue()) {
      material.addShaderDefines('USE_EMISSIVE_VALUE');
    }
    if (data.useNormalMap()) {
      material.addShaderDefines('USE_NORMAL_MAP');
    }
    if (data.useAOMap()) {
      material.addShaderDefines('USE_AO_MAP');
    }
    if (data.useUV1ForAOMap()) {
      material.addShaderDefines('USE_UV1_FOR_AO_MAP');
    }
    if (data.isTransparent()) {
      material.addShaderDefines('TRANSPARENT');
    }
    if (data.isGlass()) {
      material.addShaderDefines('GLASS');
    }
    if (data.scaleUV0()) {
      material.addShaderDefines('SCALE_UV0');
    }
    if (skinned) {
      material.addShaderDefines('SKINNED_MATRICES');
    }

    if (data.isTransparent() || data.isGlass()) {
      material.setPreMultipliedAlphaBlending();
      material.depthWrite = false;
    }
    if (shareSameMaterials) {
      this.cachedMaterials[id] = material;
    }
    this.initializedMaterials.push(material);
    return material;
  }

  public init() {
    LogGL.log('PBR ' + this.initializedMaterials.length + ' unique PBR-materials are initialized');
  }

  public setCustomShader(shader: string) {
    this.customShader = shader;
  }

  public getInitalizedMaterials(): PbrMaterial[] {
    return this.initializedMaterials;
  }

  private getMaterialIdForData(data: PbrMaterialData, skinned: boolean = false): number {
    let offset = 0;
    offset |= (data.useRoughness() ? 1 : 0) << PbrMaterialType.USE_ROUGHNESS;
    offset |= (data.useMetallic() ? 1 : 0) << PbrMaterialType.USE_METALLIC;
    offset |= (data.useEmissive() ? 1 : 0) << PbrMaterialType.USE_EMISSIVE;
    offset |= (data.useAlbedoValue() ? 1 : 0) << PbrMaterialType.USE_ALBEDO_VALUE;
    offset |= (data.useMetallicValue() ? 1 : 0) << PbrMaterialType.USE_METALLIC_VALUE;
    offset |= (data.useRoughnessValue() ? 1 : 0) << PbrMaterialType.USE_ROUGHNESS_VALUE;
    offset |= (data.useEmissiveValue() ? 1 : 0) << PbrMaterialType.USE_EMISSIVE_VALUE;
    offset |= (data.useNormalMap() ? 1 : 0) << PbrMaterialType.USE_NORMAL_MAP;
    offset |= (data.useAOMap() ? 1 : 0) << PbrMaterialType.USE_AO_MAP;
    offset |= (data.useUV1ForAOMap() ? 1 : 0) << PbrMaterialType.USE_UV1_FOR_AO_MAP;
    offset |= (data.isTransparent() ? 1 : 0) << PbrMaterialType.TRANSPARENT;
    offset |= (data.isGlass() ? 1 : 0) << PbrMaterialType.GLASS;
    offset |= (data.scaleUV0() ? 1 : 0) << PbrMaterialType.SCALE_UV0;
    offset |= (skinned ? 1 : 0) << PbrMaterialType.SKINNED_MATRICES;

    return offset;
  }

  public destruct(): void {}
}
