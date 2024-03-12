import MaterialLoader from 'mediamonks-webgl/renderer/material/MaterialLoader';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import Pentagon from "./Pentagon";
import RenderTexture from "mediamonks-webgl/renderer/texture/RenderTexture";
import TextureFormat from "mediamonks-webgl/renderer/texture/TextureFormat";
import WebGLBackground from "./WebGLBackground";
import Texture2D from "mediamonks-webgl/renderer/texture/Texture2D";

export default class Intro extends WebGLBackground {
  private material: MaterialLoader;
  public pentagon: Pentagon;
  private readonly videoTexture: Texture2D;
  private videoElement: HTMLVideoElement | undefined;

  constructor(renderer: Renderer, preloader: WebGLPreLoader) {
    super(renderer, preloader);

    this.material = new MaterialLoader(this.renderer, preloader, 'intro');
    this.material.depthWrite = false;
    this.material.depthTest = false;

    this.videoTexture = new Texture2D(this.renderer);
    if(this.renderer.isWebgl2)this.videoTexture.useMips = true;

    this.pentagon = new Pentagon(this.renderer, preloader);

    this.renderTexture = new RenderTexture(this.renderer, 1,1, TextureFormat.RGB_UNSIGNED_BYTE, false, false, true, false, false, true);
    this.renderTexture.scaleToCanvas = true;
  }

  public init(paramGroup: ParamGroup): void {
    const pg = paramGroup.addGroup('intro', this.material);

    pg.addShaderParamFloat('_Brightness', .7);
    //lowers temporal aliasing
    pg.addShaderParamInt('_Lod', 2, 0, 8);

    this.pentagon.init(paramGroup);
  }

  public draw(): void {
    if (this.videoElement && this.videoElement.readyState > 1) {
      this.videoTexture.setImage(this.videoElement);

      //TODO: do not draw the pixelated version when the pentagon is fullscreen. Or do depth test. Or stencil
      this.material.setFloat('_SourceAspectRatio', this.videoTexture.aspectRatio);
      this.material.setFloat('_AspectRatio', this.renderer.aspectRatio);
      this.renderer.blit(this.videoTexture, this.renderTexture, this.material, false);

      this.renderer.renderTarget = this.renderTexture;
      // this.renderer.clear();
      this.pentagon.draw(this.videoTexture);
      this.renderer.renderTarget = null;


      this.renderTexture.resolveMultisampleBuffer();
    }
  }

  public set pixelCount(value:number){
    this.material.setFloat('_PixelCount',value);
  }

  public set brightness(value:number){
    this.material.setFloat('_Brightness',value);
  }

  public setVideoElement(video:HTMLVideoElement | undefined){
    this.videoElement = video;
    if(video)video.style.visibility = 'hidden';
  }

  public destruct(): void {
    this.material.destruct();
    this.pentagon.destruct();
    this.videoTexture.destruct();
    this.renderTexture.destruct();
    super.destruct();
  }
}
