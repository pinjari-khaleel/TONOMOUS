import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import Fs from './shaders/GammaCorrection.part.fs.glsl';

export default class GammaCorrection extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'GammaCorrection');
    // default settings
    this.setSettings(settings, {
      gamma: 2.2,
      exposure: 1,
      levelBlack: 0,
      levelWhite: 1,
    });
  }

  public getFSCode(): string {
    return Fs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('GammaCorrection', this.getMaterial());
    pg.addShaderParamFloat('_ExposureGamma', this._settings.gamma, 0, 10);
    pg.addShaderParamFloat('_ExposureExposure', this._settings.exposure, 0, 10);
    pg.addShaderParamFloat('_ExposureLevelBlack', this._settings.levelBlack, 0, 10);
    pg.addShaderParamFloat('_ExposureLevelWhite', this._settings.levelWhite, 0, 10);
  }
}
