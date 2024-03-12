import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import rgbFs from './shaders/RgbShift.part.fs.glsl';

export default class RgbShift extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'RgbShift');
    // default settings
    this.setSettings(settings, {
      delta: 5,
    });
  }

  public getFSCode(): string {
    return rgbFs;
  }

  public shaderSetsColor(): boolean {
    return true;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('RgbShift', this.getMaterial());
    pg.addShaderParamFloat('_RgbShiftDelta', this._settings.delta, 0, 50);
  }
}
