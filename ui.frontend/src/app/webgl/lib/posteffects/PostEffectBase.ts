import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import Material from 'mediamonks-webgl/renderer/material/Material';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import RenderTexture from 'mediamonks-webgl/renderer/texture/RenderTexture';
import TextureFormat from 'mediamonks-webgl/renderer/texture/TextureFormat';

import baseVs from './shaders/Base.vs.glsl';
import baseFs from './shaders/Base.fs.glsl';
import Shader from 'mediamonks-webgl/renderer/material/Shader';
import Time from 'mediamonks-webgl/renderer/core/Time';

export default class PostEffectBase {
  public _name: string = 'PostEffectBase';
  protected _renderer: Renderer;
  protected _settings: any;
  protected _material!: Material;
  protected _standAlone: boolean = true;

  protected _outputBuffer!: RenderTexture;
  protected _output!: Texture2D;

  protected _generatedShader: string = '';

  protected _enabled: boolean = true;

  constructor(renderer: Renderer, name: string) {
    this._renderer = renderer;
    this._name = name;

    if (this._renderer.antialias) {
      LogGL.error(
        'You have enabled MSAA but also using post effects, so MSAA is probably not needed.',
      );
    }
  }

  protected setSettings(settings: any, defaultSettings = {}) {
    this._settings = Object.assign(defaultSettings, settings);

    LogGL.log('Post Effect: ' + this._name, this._settings);
  }

  public init(paramGroup: ParamGroup): void {
    this.initMaterial();

    if (this._standAlone) {
      const halfFloat: boolean =
        this._renderer.extensionManager.color_buffer_half_float &&
        this._renderer.extensionManager.texture_half_float;
      this._outputBuffer = new RenderTexture(
        this._renderer,
        1,
        1,
        halfFloat ? TextureFormat.RGBA_HALF_FLOAT : TextureFormat.RGBA_UNSIGNED_BYTE,
        false,
        true,
        true,
        false,
      );
    }
  }

  protected initMaterial() {
    if (this._standAlone) {
      const name = this._name;

      const vsCode = this.getBaseVSCode();
      const fsCode = this.injectFSCode(name, this.getBaseFSCode(), this.getFSCode());
      this._generatedShader = fsCode;
      this._material = new Material(
        this._renderer,
        name,
        new Shader(this._renderer).init(name, vsCode, fsCode),
      );
      this._material.depthTest = false;
    }
  }

  public getBaseVSCode(): string {
    return baseVs;
  }

  public getBaseFSCode(): string {
    if (this.shaderSetsColor()) {
      return baseFs;
    } else {
      let str = baseFs;
      return str.replace('//EFFECTS', 'color = texture2D(uTexture, vUV).rgb;\n\n//EFFECTS');
    }
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public debug() {
    if (this._generatedShader == '') {
      console.warn('Call debug after init');
    }
    // console.log(this._generatedShader);
  }

  protected injectFSCode(name: string, code: string, inject: string) {
    let fsCode = code;
    fsCode = fsCode.replace('//FUNCTIONS', inject + '\n\n//FUNCTIONS');
    fsCode = fsCode.replace(
      '//EFFECTS',
      'color = ' + name.toLowerCase() + '(vUV, color);' + '\n\n//EFFECTS',
    );
    return fsCode;
  }

  public shaderSetsColor(): boolean {
    return false;
  }

  public getFSCode(): string {
    return '';
  }

  public update(source: Texture2D): void {}

  public standAlone(): boolean {
    return this._standAlone;
  }

  public setStandAlone(standalone: boolean): void {
    this._standAlone = standalone;
  }

  public getMaterial(): Material {
    return this._material;
  }

  public setMaterial(material: Material): void {
    this._material = material;
  }

  public draw(source: Texture2D, toScreen: boolean = false): Texture2D {
    this.update(source);

    this.getMaterial().setVector2('uResolution', source.size);
    this.getMaterial().setFloat('uTime', Time.instance.time);

    if (toScreen) {
      this._renderer.blit(source, null, this.getMaterial());
    } else {
      this._outputBuffer.setSize(source.width, source.height);
      this._renderer.blit(source, this._outputBuffer, this.getMaterial());
      this._output = this._outputBuffer;
    }
    return this.output;
  }

  public get output(): Texture2D {
    return this._output;
  }
}
