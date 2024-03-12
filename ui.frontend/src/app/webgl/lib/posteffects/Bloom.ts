import RenderTexture from 'mediamonks-webgl/renderer/texture/RenderTexture';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import TextureFormat from 'mediamonks-webgl/renderer/texture/TextureFormat';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import FloatParam from 'mediamonks-webgl/utils/uiParams/FloatParam';
import Material from 'mediamonks-webgl/renderer/material/Material';
import Shader from 'mediamonks-webgl/renderer/material/Shader';
import PostEffectBase from 'mediamonks-webgl/posteffects/PostEffectBase';
import bloomBlurFs from './shaders/BloomBlur.fs.glsl';
import bloomFs from './shaders/Bloom.part.fs.glsl';

//based on: https://catlikecoding.com/unity/tutorials/advanced-rendering/bloom/
export default class Bloom extends PostEffectBase {
  private static MAX_PASSES: number = 8;
  private _startHalfSize: boolean = true;
  private readonly _buffers: RenderTexture[];
  private _texelSize: Vector2 = new Vector2();
  public _threshold!: FloatParam;
  public _passBoost!: FloatParam;

  private _firstPass: Material;
  private _intermediatePass: Material;
  private _strengthParam!: FloatParam;

  constructor(renderer: Renderer, settings = {}) {
    super(renderer, 'Bloom');
    // default settings
    this.setSettings(settings, {
      startHalfSize: true,
      threshold: 0.8,
      passes: 7,
      strength: 1,
      passBoost: 0.25,
      forceHalfFloat: false,
    });

    this._startHalfSize = this._settings.startHalfSize;
    this._firstPass = this.createMaterial({ FIRST_PASS: 1, ALPHA_AS_EMISSIVE: 0 });

    this._intermediatePass = this.createMaterial();
    this._intermediatePass.setAdditiveBlending();

    this._buffers = this.createBuffers(Bloom.MAX_PASSES);
  }

  private createMaterial(shaderDefines: { [k: string]: any } = {}) {
    const name = 'bloom';
    let material = new Material(
      this._renderer,
      name,
      new Shader(this._renderer, shaderDefines).init(name, this.getBaseVSCode(), bloomBlurFs),
    );
    material.depthTest = false;
    return material;
  }

  public getFSCode(): string {
    return bloomFs;
  }

  public shaderSetsColor(): boolean {
    return true;
  }

  //to prevent constant resizing of RenderTextures
  private createBuffers(passes: number): RenderTexture[] {
    let buffers = [];
    let format: string = TextureFormat.RGBA_UNSIGNED_BYTE;
    if (this._settings.forceHalfFloat) format = TextureFormat.RGBA_HALF_FLOAT;
    for (let i = 0; i < passes; i++) {
      buffers.push(new RenderTexture(this._renderer, 1, 1, format, false, true, true, false));
    }
    return buffers;
  }

  public init(paramGroup: ParamGroup): void {
    super.init(paramGroup);

    let pg: ParamGroup = paramGroup.addGroup('Bloom', [this._firstPass, this._intermediatePass]);
    this._threshold = pg.addParamFloat('_BloomThreshold', this._settings.threshold, 0, 0.99);
    this._passBoost = pg.addParamFloat('_PassBoost', this._settings.passBoost);
    pg.addShaderParamFloat('_BloomStrength', this._settings.strength, 0, 1, (x) => {
      this._enabled = !Utils.Approximately(x, 0);
    });
  }

  public update(source: Texture2D): void {
    let destination: RenderTexture;
    let intermediateSource = source;

    let w = intermediateSource.width;
    let h = intermediateSource.height;

    //resolution based pass count
    let nRes = Math.log(source.height * 0.1) / Math.log(2);
    let n = Math.min(Math.round(nRes), Bloom.MAX_PASSES);

    this._intermediatePass.setFloat('_PassBoost', this._passBoost.value);
    this._firstPass.setFloat('_PassBoost', this._passBoost.value);

    //downScale
    for (let i = 0; i < n; i++) {
      if (this._startHalfSize) {
        w = Math.floor(w * 0.5);
        h = Math.floor(h * 0.5);
      }

      destination = this._buffers[i];
      destination.setSize(w, h);

      if (i == 0) {
        if (this._startHalfSize) {
          this._texelSize.setValues(1 / intermediateSource.width, 1 / intermediateSource.height);
        } else {
          this._texelSize.setValues(
            0.5 / intermediateSource.width,
            0.5 / intermediateSource.height,
          );
        }

        this._firstPass.setVector2('_BloomSourceTexelSize', this._texelSize);
        this._firstPass.setFloat('_BloomThreshold', this._threshold.value);
        this._renderer.blit(intermediateSource, destination, this._firstPass, true);
      } else {
        this._texelSize.setValues(1 / intermediateSource.width, 1 / intermediateSource.height);
        this._intermediatePass.setVector2('_BloomSourceTexelSize', this._texelSize);
        this._renderer.blit(intermediateSource, destination, this._intermediatePass, true);
      }
      intermediateSource = destination;

      if (!this._startHalfSize) {
        w = Math.floor(w * 0.5);
        h = Math.floor(h * 0.5);
      }
    }

    this._intermediatePass.setFloat('_PassBoost', 0);

    //upscale
    for (let i = 1; i < n; i++) {
      destination = this._buffers[n - i - 1];

      this._texelSize.setValues(0.5 / intermediateSource.width, 0.5 / intermediateSource.height);
      this._intermediatePass.setVector2('_BloomSourceTexelSize', this._texelSize);
      //note that earlier output is blended on top.
      this._renderer.blit(intermediateSource, destination, this._intermediatePass, false);
      intermediateSource = destination;
      this._bloomOutput = destination;
    }

    this.getMaterial().setTexture('_BloomSource', this._bloomOutput);
  }

  //for use without the stack
  private _bloomOutput!: Texture2D;
  public get bloomOutput(): Texture2D {
    return this._bloomOutput;
  }

  public get strength(): number {
    return this._strengthParam.value;
  }
}
