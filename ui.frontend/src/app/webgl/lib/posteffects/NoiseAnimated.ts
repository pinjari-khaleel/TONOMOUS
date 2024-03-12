import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import Fs from './shaders/NoiseAnimated.part.fs.glsl';

export default class NoiseAnimated extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'NoiseAnimated');
    // default settings
    this.setSettings(settings, {
      amount: 1,
    });
  }

  public getFSCode(): string {
    return Fs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('NoiseAnimated', this.getMaterial());
    pg.addShaderParamFloat('_NoiseAnimatedAmount', this._settings.amount, 0, 50);
  }
}
