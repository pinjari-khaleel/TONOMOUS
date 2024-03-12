import MaterialLoader from 'mediamonks-webgl/renderer/material/MaterialLoader';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import RenderTexture from "mediamonks-webgl/renderer/texture/RenderTexture";
import Time from "mediamonks-webgl/renderer/core/Time";
import TextureFormat from "mediamonks-webgl/renderer/texture/TextureFormat";
import WebGLBackground from "./WebGLBackground";
import Texture2D from "mediamonks-webgl/renderer/texture/Texture2D";
import Color from "mediamonks-webgl/renderer/math/Color";

export default class PixelatedBackground extends WebGLBackground {
  private material: MaterialLoader;

  constructor(renderer: Renderer, preloader: WebGLPreLoader) {
    super(renderer, preloader);
    this.renderer = renderer;

    this.material = new MaterialLoader(this.renderer, preloader, 'pixelate');
    this.material.depthTest = false;
    this.material.depthWrite = false;

    this.renderTexture = new RenderTexture(this.renderer, 1,1, TextureFormat.RGB_UNSIGNED_BYTE, false, false, true, false, false, false);
    this.renderTexture.scaleToCanvas = true;
    //draw very low res
    this.renderTexture.sizeMultiplier = .25;
  }

  public init(paramGroup: ParamGroup): void {
    const pg = paramGroup.addGroup('PixelatedBackground', this.material);

    pg.addShaderParamFloat('_PhotoOpacity', .5);
    pg.addShaderParamFloat('_Brightness', 1);
    pg.addShaderParamInt('_Lod', 2, 0, 8);

    //gradient settings
    pg.addShaderParamFloat('_Amplitude', .4);
    pg.addShaderParamFloat('_SpatialFrequency', 4, 0, 20);
    pg.addShaderParamFloat('_TemporalFrequency', .35);
    pg.addShaderParamFloat('_Twist', .5);
    pg.addShaderParamFloat('_Falloff', 0.7, 0.5, 1);
  }

  public draw(): void {
    this.material.setFloat('_Time', Time.instance.time);
    this.material.setFloat('_AspectRatio', this.renderer.aspectRatio);
    this.renderer.blit(null, this.renderTexture, this.material);
  }

  public setContent(gradientColors:Color[], photo:Texture2D | null = null){
    const colorData: Float32Array = new Float32Array(3 * 3);
    let ii = 0;
    for(const c of gradientColors){
      colorData[ii++] = c.x;
      colorData[ii++] = c.y;
      colorData[ii++] = c.z;
    }
    this.material.setVector3Array('_GradientColors', colorData);
    if(photo){
      this.material.setTexture('_Photo', photo);
      this.material.setFloat('_SourceAspectRatio', photo.aspectRatio);
      this.material.setFloat('_UsePhoto', 1);
    }else{
      this.material.setFloat('_SourceAspectRatio', 1);
      this.material.setFloat('_UsePhoto', 0);
    }
  }

  public set pixelCount(value:number){
    this.material.setFloat('_PixelCount',value);
  }

  public set brightness(value:number){
    this.material.setFloat('_Brightness',value);
  }

  public destruct(): void {
    this.material.destruct();
    this.renderTexture.destruct();
  }
}
