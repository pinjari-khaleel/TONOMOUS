import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import gsFs from './shaders/Greyscale.part.fs.glsl';

export default class Grayscale extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'Grayscale');
    // default settings
    this.setSettings(settings, {
      amount: 1,
    });
  }

  public getFSCode(): string {
    return gsFs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('Grayscale', this.getMaterial());
    pg.addShaderParamFloat('_GrayscaleAmount', this._settings.amount, 0, 1);
  }
}
