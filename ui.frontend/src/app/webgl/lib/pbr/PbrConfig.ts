import bowser from 'bowser';
import Renderer from '../renderer/render/Renderer';
import PbrEnvironment from './PbrEnvironment';
import PbrMaterial from './PbrMaterial';
import PbrCubeMapBackground from './PbrCubeMapBackground';

export class PbrConfig {
  private static _useHighQualitySettings: boolean = false; // when set to false, only uses ldr maps.
  private static _useBRDFLookupTable: boolean = false;

  public static get useHighQualitySettings(): boolean {
    return PbrConfig._useHighQualitySettings;
  }

  public static get useBRDFLookupTable(): boolean {
    return PbrConfig._useBRDFLookupTable;
  }

  public static set useHighQualitySettings(value: boolean) {
    if (!PbrConfig.checkIfSetIsAllowed()) {
      return;
    }
    PbrConfig._useHighQualitySettings = value;
  }

  public static set useBRDFLookupTable(value: boolean) {
    if (!PbrConfig.checkIfSetIsAllowed()) {
      return;
    }
    PbrConfig._useBRDFLookupTable = value;
  }

  public static get useFloatTextures(): boolean {
    // IE can't use float textures
    //TODO: write out staticExtensionManager. We could be on webgl2
    return (
      PbrConfig.useHighQualitySettings &&
      Renderer.staticExtensionManager.texture_float &&
      window.navigator.userAgent.indexOf('MSIE ') < 0 &&
      window.navigator.userAgent.indexOf('Trident') < 0 &&
      !bowser.mobile
    );
  }

  public static get useShaderForHdrToFloatConversion(): boolean {
    return PbrConfig.useHighQualitySettings && !bowser.mobile && !!bowser.chrome;
  }

  public static get useBRDFLut(): boolean {
    // return PbrConfig.useBRDFLookupTable && PbrConfig.useHighQualitySettings && PbrConfig.useFloatTextures();
    return PbrConfig.useBRDFLookupTable && PbrConfig.useHighQualitySettings;
  }

  private static checkIfSetIsAllowed(): boolean {
    if (
      PbrMaterial.instanceExists ||
      PbrEnvironment.instanceExists ||
      PbrCubeMapBackground.instanceExists
    ) {
      console.error(
        'You are not allowed to change PbrConfig after a PbrEnvironment, PbrCubeMapBackground or PbrMaterial is created',
      );
      return false;
    }
    return true;
  }

  public static destruct() {
    PbrMaterial.instanceExists = false;
    PbrEnvironment.instanceExists = false;
    PbrCubeMapBackground.instanceExists = false;
  }
}
