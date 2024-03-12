import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import Fs from './shaders/Noise.part.fs.glsl';

export default class Noise extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'Noise');
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

    let pg: ParamGroup = paramGroup.addGroup('Noise', this.getMaterial());
    pg.addShaderParamFloat('_NoiseAmount', this._settings.amount, 0, 50);
  }
}
