import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import Fs from './shaders/Fxaa.part.fs.glsl';

export default class Fxaa extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'Fxaa');
    // default settings
    this.setSettings(settings, {
      strength: 10,
    });
  }

  public getFSCode(): string {
    return Fs;
  }

  public shaderSetsColor(): boolean {
    return true;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('FXAA', this.getMaterial());
    pg.addShaderParamFloat('_FxaaStrength', this._settings.strength, 0, 20);
  }
}
