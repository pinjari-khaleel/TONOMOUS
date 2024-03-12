import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import Fs from './shaders/DisplacementNoise.part.fs.glsl';
import Utils from 'mediamonks-webgl/renderer/core/Utils';

export default class DisplacementNoise extends PostEffectBase {
  private _tex: Texture2D;

  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'displacementnoise');

    // default settings
    this.setSettings(settings, {
      offset: 0,
      scale: 25,
      strength: 0,
      speed: 0,
    });
    // @ts-ignore
    this._tex = <Texture2D>settings['texture'];
    if (!this._tex) {
      console.error('AddTexture needs a (fbm) texture');
    }
  }

  public getFSCode(): string {
    return Fs;
  }

  public shaderSetsColor(): boolean {
    return true;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('DisplacementNoise', this.getMaterial());
    pg.addShaderParamFloat('_Disp_Scale', this._settings.scale, 0, 50);
    pg.addShaderParamFloat('_Disp_Strength', this._settings.strength, 0, 0.02, (x) => {
      this._enabled = !Utils.Approximately(x, 0);
    });
    pg.addShaderParamFloat('_Disp_Speed', this._settings.speed, 0, 1.0);

    this.getMaterial().setTexture('_DisplacementTex', this._tex);
    this.getMaterial().setVector2('_DisplacementTexSize', this._tex.size);
  }
}
