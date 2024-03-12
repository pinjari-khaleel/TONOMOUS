import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import vignetteFs from './shaders/Vignette.part.fs.glsl';

export default class Vignette extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'Vignette');
    // default settings
    this.setSettings(settings, {
      pow: 0.25,
      reduction: 0.5,
    });
  }

  public getFSCode(): string {
    return vignetteFs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('Vignette', this.getMaterial());
    pg.addShaderParamFloat('_VignettePow', this._settings.pow, 0, 2);
    pg.addShaderParamFloat('_VignetteReduction', this._settings.reduction, 0, 2);
  }
}
