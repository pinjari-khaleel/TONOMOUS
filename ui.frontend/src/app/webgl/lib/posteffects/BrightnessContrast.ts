import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import Fs from './shaders/BrightnessContrast.part.fs.glsl';

export default class BrightnessContrast extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'BrightnessContrast');
    // default settings
    this.setSettings(settings, {
      brightness: 1,
      contrast: 0,
    });
  }

  public getFSCode(): string {
    return Fs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('BrightnessContrast', this.getMaterial());
    pg.addShaderParamFloat('_BrightnessContrastBrightness', this._settings.brightness, 0, 5);
    pg.addShaderParamFloat('_BrightnessContrastContrast', this._settings.contrast, 0, 1);
  }
}
