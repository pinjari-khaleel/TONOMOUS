import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import gsFs from './shaders/AcesTonemap.part.fs.glsl';

export default class AcesTonemap extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'AcesTonemap');
    // default settings
    this.setSettings(settings, {
      gamma: 2.2,
    });
  }

  public getFSCode(): string {
    return gsFs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('AcesTonemap', this.getMaterial());
    pg.addShaderParamFloat('_AcesToneMapGamma', this._settings.gamma, 0, 4);
  }
}
