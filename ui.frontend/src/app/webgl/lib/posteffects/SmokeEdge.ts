import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

import Fs from './shaders/SmokeEdge.part.fs.glsl';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';

export default class SmokeEdge extends PostEffectBase {
  private _tex: Texture2D;

  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'SmokeEdge');
    // default settings
    this.setSettings(settings, {
      strength: 1,
    });
    // @ts-ignore
    this._tex = settings['texture'];
    if (!this._tex) {
      console.error('SmokeEdge needs a (fbm) texture');
    }
  }

  public getFSCode(): string {
    return Fs;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('SmokeEdge', this.getMaterial());
    pg.addShaderParamFloat('_SmokeEdgeStrength', this._settings.strength, 0, 2);
    this.getMaterial().setTexture('_SmokeEdgeTex', this._tex);
  }
}
