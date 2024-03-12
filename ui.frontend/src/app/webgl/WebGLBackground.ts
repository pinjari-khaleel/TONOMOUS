import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import RenderTexture from "mediamonks-webgl/renderer/texture/RenderTexture";
import IWebGLDestructible from "mediamonks-webgl/renderer/core/IWebGLDestructible";

export default class WebGLBackground implements IWebGLDestructible {
  protected renderer: Renderer;
  public renderTexture!:RenderTexture;

  constructor(renderer: Renderer, preloader: WebGLPreLoader) {
    this.renderer = renderer;
  }

  public init(paramGroup: ParamGroup): void {
  }

  public draw(): void {
  }

  public set pixelCount(value:number){
  }

  public destruct(): void {
  }
}
