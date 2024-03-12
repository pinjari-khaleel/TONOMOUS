import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import barrelFs from './shaders/Barrel.part.fs.glsl';

export default class Barrel extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'Barrel');
    // default settings
    this.setSettings(settings, {
      k: -0.1,
      kcube: 0,
    });
  }

  public getFSCode(): string {
    return barrelFs;
  }

  public shaderSetsColor(): boolean {
    return true;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('Barrel', this.getMaterial());
    pg.addShaderParamFloat('_BarrelK', this._settings.k, -1, 1);
    pg.addShaderParamFloat('_BarrelKCube', this._settings.kcube, -1, 1);
  }
}
