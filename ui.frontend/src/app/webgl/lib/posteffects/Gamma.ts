import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import Fs from './shaders/Gamma.part.fs.glsl';

export default class Gamma extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'Gamma');
    // default settings
    this.setSettings(settings, {
      gamma: 2.2,
    });
  }

  public getFSCode(): string {
    return Fs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('Gamma', this.getMaterial());
    pg.addShaderParamFloat('_Gamma', this._settings.gamma, 0, 5);
  }
}
