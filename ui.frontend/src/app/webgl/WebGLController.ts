import DatGui from 'mediamonks-webgl/utils/uiParams/DatGui';
import CanvasManager from 'mediamonks-webgl/renderer/core/CanvasManager';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Time from 'mediamonks-webgl/renderer/core/Time';
import EventDispatcher from 'seng-event';
import IWebGLDestructible from 'mediamonks-webgl/renderer/core/IWebGLDestructible';
import Color from "mediamonks-webgl/renderer/math/Color";
import RendererWebGL2 from "mediamonks-webgl/renderer/render/RendererWebGL2";
import MaterialLoader from "mediamonks-webgl/renderer/material/MaterialLoader";
import Texture2D from "mediamonks-webgl/renderer/texture/Texture2D";
import Tween from "mediamonks-webgl/utils/animation/Tween";
import ParamGroup from "mediamonks-webgl/utils/uiParams/ParamGroup";
import WebGLBackground from "./WebGLBackground";
import PixelatedBackground from "./PixelatedBackground";
import Intro from "./Intro";
import Vector2 from './lib/renderer/math/Vector2';
import lerp from 'lerp';
import RendererWebGL1 from "mediamonks-webgl/renderer/render/RendererWebGL1";

export default class WebGLController implements IWebGLDestructible {
  private datGui: DatGui | undefined;
  public renderer: Renderer;
  public paused = false;
  public eventDispatcher: EventDispatcher;
  private canvasManager: CanvasManager;

  private material: MaterialLoader;
  private sourceA: WebGLBackground;
  private sourceB: WebGLBackground;
  private transitionTween: Tween = new Tween<number>(1);
  private intro: Intro;
  private backgroundA: PixelatedBackground;
  private backgroundB: PixelatedBackground;

  private mouseVelocity: Vector2 = new Vector2(0, 0);

  constructor(
    eventDispatcher: EventDispatcher,
    canvasParent: HTMLElement,
    preloader: WebGLPreLoader,
    uiVisible: boolean,
  ) {
    this.eventDispatcher = eventDispatcher;
    this.canvasManager = new CanvasManager(canvasParent);

    const attributes = {
      alpha: false,
      stencil: false,
      premultipliedAlpha: false,
      antialias: true,
      xrCompatible: false,
      autoClear: true,
    };

    let gl2 = Boolean(this.canvasManager.canvas.getContext('webgl2', attributes));

    //the test context has to be retrieved with the same parameters
    if (!gl2) {
      this.renderer = new RendererWebGL1(
        preloader,
        this.canvasManager.canvas,
        require.context('./shaders', true),
        attributes.antialias,
        attributes.alpha,
        attributes.autoClear,
        attributes.stencil,
        attributes.xrCompatible,
      );
    } else {
      this.renderer = new RendererWebGL2(
        preloader,
        this.canvasManager.canvas,
        require.context('./shaders', true),
        attributes.antialias,
        attributes.alpha,
        attributes.autoClear,
        attributes.stencil,
        attributes.xrCompatible,
      );
    }

/*    try {
      this.renderer = new RendererWebGL2(preloader, this.canvasManager.canvas, require.context('./shaders', true), true);
    } catch (e) {
      this.renderer = new RendererWebGL1(preloader, this.canvasManager.canvas, require.context('./shaders', true),true);
    }*/

    this.material = new MaterialLoader(this.renderer, preloader, 'transition');
    this.material.depthTest = false;
    this.material.depthWrite = false;

    this.intro = new Intro(this.renderer, preloader);
    this.backgroundA = new PixelatedBackground(this.renderer, preloader);
    this.backgroundB = new PixelatedBackground(this.renderer, preloader);

    this.sourceA = this.intro;
    this.sourceB = this.intro;

    if (uiVisible) this.datGui = new DatGui(preloader);
  }

  public init(): void {
    let paramGroup: ParamGroup = new ParamGroup();
    paramGroup.init('controls');

    this.intro.init(paramGroup);
    this.backgroundA.init(paramGroup);
    this.backgroundB.init(paramGroup);

    const pg = paramGroup.addGroup('transition', this.material);
    this.setMouseEffectStrength(.5);
    this.pixelCount = 48;
    pg.addShaderParamFloat('_MaskRange', 0.1);

    this.renderer.init();
    this.renderer.clearColor = new Color(0, 0, 0, 1);

    this.datGui?.init(paramGroup);
    this.canvasManager.update(0);

    this.update();
  }

  public update(): void {

    if(!this.paused) {
      const dt = Time.instance.deltaTime;
      this.transitionTween.update(dt);

      this.canvasManager.update(dt);

      this.sourceB.draw();

      if(this.transitionTween.value < 1) {
        this.sourceA.draw();
      }

      const currentVelocity = this.renderer.mouseListener.normalizedVelocity;
      currentVelocity.x *= -1;
      this.mouseVelocity = Vector2.lerp(this.mouseVelocity, currentVelocity, Math.min(dt, 1));

      this.material.setVector2('_MouseVel', this.mouseVelocity);
      this.material.setVector2('_MousePos', this.renderer.mouseListener.normalizedPos);
      this.material.setFloat('_Time', Time.instance.time);
      this.material.setFloat('_AspectRatio', this.renderer.aspectRatio);
      this.material.setFloat('_MaskProgress', this.transitionTween.value);
      this.material.setTexture('_SourceA', this.sourceA.renderTexture);
      this.material.setTexture('_SourceB', this.sourceB.renderTexture);
      this.renderer.blit(null, null, this.material);

      //fix for warning: 'webgl Feedback loop formed between Framebuffer and active Texture'
      this.material.unSetTexture('_SourceA');
      this.material.unSetTexture('_SourceB');
    }
    window.requestAnimationFrame(() => this.update());
  }

  //coords between 0 and 1. Update each frame
  public setPentagonPoints(points: ReadonlyArray<[number, number]>){
    this.intro.pentagon.setPoints(points);
  }

  public transitionToIntro(duration:number, onComplete:() => void){
    if(this.sourceB != this.intro) {
      this.sourceA = this.sourceB;
      this.sourceB = this.intro;
      this.transitionTween.fromTo(0, 1, duration, undefined, onComplete);
    }else{
      // console.warn('transitionToIntro: source is already set to intro');
      onComplete();
    }
  }

  public transitionTo(gradientColors:Color[], photo:Texture2D | null, duration:number, onComplete:() => void){
    if(gradientColors.length != 3)console.warn('exactly 3 gradient colors should be provided');
    this.sourceA = this.sourceB;
    const background:PixelatedBackground = this.sourceA == this.backgroundA? this.backgroundB : this.backgroundA;
    background.setContent(gradientColors, photo);
    this.sourceB = background;
    this.transitionTween.fromTo(0, 1, duration, undefined, onComplete);
  }

  //amount of pixels over the x axis
  public set pixelCount(value:number){
    this.material.setFloat('_PixelCount',value);
    this.intro.pixelCount = value;
    this.backgroundA.pixelCount = value;
    this.backgroundB.pixelCount = value;
  }

  public set brightness(value:number){
    this.intro.brightness = value;
    this.backgroundA.brightness = value;
    this.backgroundB.brightness = value;
  }

  public setVideoElement(element:HTMLVideoElement| undefined){
    this.intro.setVideoElement(element);
  }

  public setMouseEffectStrength(value:number){
    this.material.setFloat('_ShiftAmp', value * 100);
  }

  public destruct() {
    this.datGui?.destruct();
    this.canvasManager.destruct();
    this.renderer.destruct();
  }
}
