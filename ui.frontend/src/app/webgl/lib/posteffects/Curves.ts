import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import Fs from './shaders/Curves.part.fs.glsl';

export default class Curves extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'Curves');
    // default settings
    this.setSettings(settings, {
      contrast: 0,
      blacks: 1,
      shadows: 1,
      midtones: 1,
      highlights: 1,
      whites: 1,
    });
  }

  public getFSCode(): string {
    return Fs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('Curves', this.getMaterial());
    pg.addShaderParamFloat('_CurvesContrast', this._settings.contrast, 0, 1);
    pg.addShaderParamFloat('_CurvesBlacks', this._settings.blacks, 0, 2);
    pg.addShaderParamFloat('_CurvesShadows', this._settings.shadows, 0, 2);
    pg.addShaderParamFloat('_CurvesMidtones', this._settings.midtones, 0, 2);
    pg.addShaderParamFloat('_CurvesHighlights', this._settings.highlights, 0, 2);
    pg.addShaderParamFloat('_CurvesWhites', this._settings.whites, 0, 2);
  }
}
