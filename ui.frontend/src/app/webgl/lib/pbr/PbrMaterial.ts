import WebGLPreLoader from '../renderer/core/WebGLPreLoader';
import Renderer from '../renderer/render/Renderer';
import MaterialLoader from '../renderer/material/MaterialLoader';
import PbrEnvironment from './PbrEnvironment';
import PbrMaterialData from './PbrMaterialData';
import { PbrConfig } from './PbrConfig';
import TextureCube from 'mediamonks-webgl/renderer/texture/TextureCube';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';

class PbrMaterial extends MaterialLoader {
  private _lodSupported: boolean;

  private environmentSet = false;
  private materialDataSet = false;

  public static instanceExists: boolean = false;

  /**
   * Don't forget to set the environment and material data before using this material, failing to do so will result
   * in illegible WebGL errors.
   */
  constructor(renderer: Renderer, preloader: WebGLPreLoader, customshader: string | null = null) {
    super(renderer, preloader, customshader !== null ? customshader : 'pbrStandard');

    PbrMaterial.instanceExists = true;

    if (!PbrConfig.useFloatTextures) {
      this.addShaderDefines('LDR_MAPS');
    }
    if (!renderer.extensionManager.shader_texture_lod) {
      this.addShaderDefines('NO_LOD_EXTENSION');
      this._lodSupported = false;
    } else {
      this._lodSupported = true;
    }

    if (!PbrConfig.useBRDFLut) {
      this.addShaderDefines('NO_BDRF_LUT');
    }
  }

  public setPbrEnvironment(environment: PbrEnvironment) {
    if (PbrConfig.useBRDFLut) {
      // there is an '!' after brdfLutTexture to tell the compiler we know it exist if useBRDFLut() == true
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
    if (!this._lodSupported) {
      this.setTexture('_PrefilterMapMapLow', <TextureCube>environment.specularCubeLow);
    }

    this.environmentSet = true;
  }

  public setPbrMaterialData(data: PbrMaterialData) {
    if (data.albedoMap) {
      this.setTexture('_AlbedoMap', data.albedoMap);
    }
    if (data.roughnessMap) {
      this.setTexture('_RoughnessMap', data.roughnessMap);
    }
    if (data.metallicMap) {
      this.setTexture('_MetallicMap', data.metallicMap);
    }
    if (data.emissiveMap) {
      this.setTexture('_EmissiveMap', data.emissiveMap);
    }

    if (data.useAlbedoValue()) {
      this.setVector3('_Albedo', <Vector3>data.albedoValue);
    }
    if (data.useRoughnessValue()) {
      this.setFloat('_Roughness', data.roughnessValue);
    }
    if (data.useMetallicValue()) {
      this.setFloat('_Metallic', data.metallicValue);
    }
    if (data.useEmissiveValue()) {
      this.setVector3('_Emissive', <Vector3>data.emissiveValue);
    }

    if (data.normalMap) {
      this.setTexture('_NormalMap', data.normalMap);
    }
    if (data.aoMap) {
      this.setTexture('_AOMap', data.aoMap);
    }

    if (data.scaleUV0()) {
      this.setFloat('_UV0Scale', data.uv0Scale);
    }

    this.materialDataSet = true;
  }
}

export default PbrMaterial;
