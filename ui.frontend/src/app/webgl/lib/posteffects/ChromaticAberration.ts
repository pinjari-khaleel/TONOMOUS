import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import caFs from './shaders/ChromaticAberration.part.fs.glsl';
import Utils from 'mediamonks-webgl/renderer/core/Utils';

export default class ChromaticAberration extends PostEffectBase {
  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'ChromaticAberration');
    // default settings
    this.setSettings(settings, {
      maxDistort: 0.2,
    });
  }

  public getFSCode(): string {
    return caFs;
  }

  public shaderSetsColor(): boolean {
    return true;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('ChromaticAberration', this.getMaterial());
    pg.addShaderParamFloat(
      '_ChromaticAbberationMaxDistort',
      this._settings.maxDistort,
      0,
      1,
      (x) => {
        this._enabled = !Utils.Approximately(x, 0);
      },
    );
  }
}
