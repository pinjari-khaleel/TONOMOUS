import RenderTexture from 'mediamonks-webgl/renderer/texture/RenderTexture';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import TextureFormat from 'mediamonks-webgl/renderer/texture/TextureFormat';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import FloatParam from 'mediamonks-webgl/utils/uiParams/FloatParam';
import Material from 'mediamonks-webgl/renderer/material/Material';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import baseVs from './shaders/bloom/bloom.vs.glsl';
import baseFs from './shaders/bloom/bloom.fs.glsl';
import Shader from 'mediamonks-webgl/renderer/material/Shader';
import BoolParam from 'mediamonks-webgl/utils/uiParams/BoolParam';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import IWebGLDestructible from '../renderer/core/IWebGLDestructible';

export default class BloomStandAlone implements IWebGLDestructible {
  //bloom will not always look the same based on resolution
  private static MAX_PASSES: number = 9;

  private readonly _buffers: RenderTexture[];
  private readonly _output: RenderTexture | null = null;
  private _texelSize: Vector2 = new Vector2();
  public threshold!: FloatParam;
  public passBoost!: FloatParam;
  public _distance!: FloatParam;

  private _firstPass: Material;
  private _intermediatePass: Material;
  private _lastPass: Material;
  private _renderer: Renderer;
  private _startHalfSize!: BoolParam;
  private enabled!: BoolParam;
  private _settings: any;

  constructor(renderer: Renderer, preloader: WebGLPreLoader, settings: any) {
    this._renderer = renderer;

    this._firstPass = this.getMaterial({
      FIRST_PASS: 1,
      ALPHA_AS_EMISSIVE: settings.alphaAsEmissive ? 1 : 0,
    });

    this._intermediatePass = this.getMaterial();
    this._intermediatePass.setAdditiveBlending();

    this._lastPass = this.getMaterial({ LAST_PASS: 1 });

    this.setSettings(settings, {
      threshold: 0.8,
      strength: 0.25,
      passBoost: 0.25,
      alphaAsEmissive: false,
      lastPassAdditive: false,
      drawToTexture: false,
      floatBuffers: false,
      rotateSample: 0,
      noiseAmount: 0,
      autoThreshold: false,
      autoThresholdValue: 0.15,
      halfRes: true,
    });

    if (this._settings.lastPassAdditive) {
      this._lastPass.setAdditiveBlending();
    }
    this._buffers = this.createBuffers(BloomStandAlone.MAX_PASSES, this._settings.floatBuffers);

    if (this._settings.drawToTexture) {
      this._output = new RenderTexture(renderer, 1, 1, TextureFormat.RGB_UNSIGNED_BYTE);
      this._output.scaleToCanvas = true;
    }
  }

  protected setSettings(settings: any, defaultSettings = {}) {
    this._settings = Object.assign(defaultSettings, settings);

    LogGL.log('BloomStandAlone: ', this._settings);
  }

  private getMaterial(shaderDefines: { [k: string]: any } = {}) {
    const name = 'bloom';
    let material = new Material(
      this._renderer,
      name,
      new Shader(this._renderer, shaderDefines).init(name, baseVs, baseFs),
    );
    material.depthTest = false;
    return material;
  }

  //to prevent constant resizing of RenderTextures
  private createBuffers(passes: number, floatBuffers: boolean): RenderTexture[] {
    const type = floatBuffers
      ? TextureFormat.RGBA_HALF_FLOAT
      : this._settings.autoThreshold
      ? TextureFormat.RGBA_UNSIGNED_BYTE
      : TextureFormat.RGB_UNSIGNED_BYTE;
    let buffers = [];
    for (let i = 0; i < passes; i++) {
      buffers.push(new RenderTexture(this._renderer, 1, 1, type, false, true, true, false));
    }
    return buffers;
  }

  public init(paramGroup: ParamGroup): void {
    let pg: ParamGroup = paramGroup.addGroup('Bloom', [
      this._firstPass,
      this._intermediatePass,
      this._lastPass,
    ]);
    this.enabled = pg.addParamBool('enabled', true);

    let max = 1;
    if (this._settings.floatBuffers) {
      max = 10;
    } else if (this._settings.alphaAsEmissive) {
      max = 2;
    }
    this.threshold = pg.addParamFloat('_Threshold', this._settings.threshold, 0, max);
    this.passBoost = pg.addParamFloat('_PassBoost', this._settings.passBoost);
    pg.addShaderParamFloat('_Strength', this._settings.strength, 0, 2);
    pg.addShaderParamFloat('_NoiseAmount', this._settings.noiseAmount);
    pg.addShaderParamFloat('_RotateSample', this._settings.rotateSample);
    this._startHalfSize = pg.addParamBool('_HalfRes', this._settings.halfRes);
  }

  public draw(source: Texture2D): RenderTexture | null {
    if (this.enabled.value) {
      let destination: RenderTexture;
      let intermediateSource = source;

      let w = intermediateSource.width;
      let h = intermediateSource.height;

      //resolution based pass count
      const nx = Math.log(source.width * 0.5) / Math.log(2);
      const ny = Math.log(source.height * 0.5) / Math.log(2);
      const n = Math.floor(Math.min(BloomStandAlone.MAX_PASSES, Math.min(nx, ny)));

      this._intermediatePass.setFloat('_PassBoost', this.passBoost.value);
      this._firstPass.setFloat('_PassBoost', this.passBoost.value);

      //downScale
      for (let i = 0; i < n; i++) {
        if (this._startHalfSize.value) {
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

          this._firstPass.setVector2('_SourceTexelSize', this._texelSize);
          this._firstPass.setFloat('_Threshold', this.threshold.value);
          this._renderer.blit(intermediateSource, destination, this._firstPass, true);
        } else {
          this._texelSize.setValues(1 / intermediateSource.width, 1 / intermediateSource.height);
          this._intermediatePass.setVector2('_SourceTexelSize', this._texelSize);
          this._renderer.blit(intermediateSource, destination, this._intermediatePass, true);
        }

        intermediateSource = destination;

        if (!this._startHalfSize.value) {
          w = Math.floor(w * 0.5);
          h = Math.floor(h * 0.5);
        }
      }

      if (this._settings.autoThreshold) {
        if (intermediateSource) {
          const data: Uint8Array = <Uint8Array>intermediateSource.getData();
          let brightness = 0;
          const n = data.length / 4;
          for (let i = 0; i < n; i++) {
            brightness += data[i * 4 + 0];
            brightness += data[i * 4 + 1];
            brightness += data[i * 4 + 2];
          }
          brightness /= n;
          brightness /= 255;
          let t = this.threshold.value;
          t += brightness < this._settings.autoThresholdValue ? -0.005 : 0.005;
          t = Utils.clamp01(t);
          this.threshold.setValue(t);
        }
      }

      this._intermediatePass.setFloat('_PassBoost', 0);

      //upscale
      for (let i = 1; i < n; i++) {
        destination = this._buffers[n - i - 1];

        this._texelSize.setValues(0.5 / intermediateSource.width, 0.5 / intermediateSource.height);

        if (i == n - 1) {
          //note that earlier output is blended on top.
          this._lastPass.setTexture('uSource', source);
          this._lastPass.setVector2('_SourceTexelSize', this._texelSize);
          this._renderer.blit(
            intermediateSource,
            this._output,
            this._lastPass,
            this._settings.drawToTexture,
          );
        } else {
          this._intermediatePass.setVector2('_SourceTexelSize', this._texelSize);
          //note that earlier output is blended on top.
          this._renderer.blit(intermediateSource, destination, this._intermediatePass, false);
          intermediateSource = destination;
        }
      }
    } else {
      this._renderer.blit(source);
      //this._output = source;
    }
    return this._output;
  }

  public destruct() {
    for (let buffer of this._buffers) buffer.destruct();
    this._firstPass.destruct();
    this._intermediatePass.destruct();
    this._lastPass.destruct();
  }
}
