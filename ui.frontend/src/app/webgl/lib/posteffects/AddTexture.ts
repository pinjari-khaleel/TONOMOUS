import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import Fs from './shaders/AddTexture.part.fs.glsl';

export default class AddTexture extends PostEffectBase {
  private _tex: Texture2D;

  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'AddTexture');

    // default settings
    this.setSettings(settings, {
      offset: 0,
      scale: 1,
      strength: 1,
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

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('AddTexture', this.getMaterial());
    pg.addShaderParamFloat('_AddTextureOffset', this._settings.offset, -1, 1);
    pg.addShaderParamFloat('_AddTextureScale', this._settings.scale, 0, 1);
    pg.addShaderParamFloat('_AddTextureStrength', this._settings.strength, 0, 2);

    this.getMaterial().setTexture('_AddTextureTex', this._tex);
    this.getMaterial().setVector2('_AddTextureTexSize', this._tex.size);
  }
}
