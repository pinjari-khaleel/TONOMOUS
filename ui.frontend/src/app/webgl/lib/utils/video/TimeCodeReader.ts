import LogGL from '../../renderer/core/LogGL';
import Vector2 from '../../renderer/math/Vector2';
import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import MaterialLoader from '../../renderer/material/MaterialLoader';
import Renderer from '../../renderer/render/Renderer';
import RenderTexture from '../../renderer/texture/RenderTexture';
import Texture2D from '../../renderer/texture/Texture2D';
import TextureFormat from '../../renderer/texture/TextureFormat';

export default class TimeCodeReader {
  private _material: MaterialLoader;
  private _renderTexture: RenderTexture;
  private _renderer: Renderer;
  private _bitsToRead: number = 16;
  private _res: Vector2 = new Vector2();
  private _oldFrame: number = 0;
  private _droppedFrames: number = 0;
  private _log: boolean;

  constructor(renderer: Renderer, preloader: WebGLPreLoader, log: boolean) {
    this._log = log;
    this._renderer = renderer;

    this._material = new MaterialLoader(this._renderer, preloader, 'crop');
    this._material.depthWrite = false;
    this._material.depthTest = false;
    this._renderTexture = new RenderTexture(
      this._renderer,
      this._bitsToRead,
      1,
      TextureFormat.RGBA_UNSIGNED_BYTE,
      false,
      false,
      false,
      false,
    );
  }

  public getFrameNumber(texture: Texture2D, bitPixelSize: number): number {
    this._res.setValues(texture.width, texture.height);
    this._material.setVector2('uRes', this._res);
    let width = (this._bitsToRead * bitPixelSize) / texture.width;
    this._material.setFloat('uWidth', width);
    this._renderer.blit(texture, this._renderTexture, this._material);

    // this._renderer.blit(this._renderTexture);

    let data: Uint8Array = this._renderTexture.getUint8Data();
    let frame = 0;
    for (let i = 0; i < this._bitsToRead; i++) {
      let bit = data[i * 4] > 128 ? 1 : 0;
      frame += bit * Math.pow(2, i);
    }
    this.log(frame);

    return frame;
  }

  private log(frame: number) {
    if (this._log) {
      let delta = frame - this._oldFrame;
      if (delta > 1) {
        this._droppedFrames += delta - 1;
      }

      //looped
      if (frame < this._oldFrame) {
        this._droppedFrames = 0;
      }

      let perc = Math.round((this._droppedFrames / frame) * 100);
      if (isNaN(perc)) {
        perc = 0;
      }
      this._oldFrame = frame;

      let text = '';
      text += 'Frame: ' + frame;
      text += '<br />';
      text += 'DroppedFrames: ' + this._droppedFrames + '(' + perc + '% )';
      LogGL.logToScreen(text);
    }
    return frame;
  }
}
