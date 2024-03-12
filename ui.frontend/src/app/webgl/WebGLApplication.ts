import EventDispatcher from 'seng-event';
import WebGLTextureConfig from './WebGLTextureConfig';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import WebGLController from './WebGLController';
import ExternalControl from "./ExternalControl";
import Color from "mediamonks-webgl/renderer/math/Color";
import Texture2D from "mediamonks-webgl/renderer/texture/Texture2D";
import Renderer from "mediamonks-webgl/renderer/render/Renderer";
import TextureLoader from './lib/utils/loaders/TextureLoader';

const assetContext = require.context(
  './data/',
  true,
  /\.png|\.webp|\.mp4|\.jpg$/
);
//http://localhost:9000/tonomus-webgl-test.html
export default class WebGLApplication extends EventDispatcher {
  private static webglApp: WebGLController;
  public static preloader: WebGLPreLoader;
  private static externalControl: ExternalControl | undefined;

  public init(
    canvasWrapper: HTMLElement,
    uiVisible: boolean = false,
    webpSupported: boolean = false,
  ): void {
    if (!WebGLApplication.webglApp) {
      LogGL.ENABLED = uiVisible;
      WebGLTextureConfig.useWebp = webpSupported;
      WebGLApplication.preloader = new WebGLPreLoader();
      WebGLApplication.webglApp = new WebGLController(
        this,
        canvasWrapper,
        WebGLApplication.preloader,
        uiVisible,
      );

      if (uiVisible) {
        WebGLApplication.externalControl = new ExternalControl(this, WebGLApplication.preloader);
        WebGLApplication.addStats();
      }
    }
  }

  public load(onComplete: () => void, onProgress: (p: number) => void = () => {}): void {
    WebGLApplication.preloader.load(() => {
      WebGLApplication.webglApp.init();
      WebGLApplication.externalControl?.init();
      onComplete();
    }, onProgress);
  }

  public play() {
    WebGLApplication.webglApp.paused = false;
  }

  public pause() {
    WebGLApplication.webglApp.paused = true;
  }

  //in 0->1 space, y is probably flipped
  public setPentagonPoints(points: ReadonlyArray<[number, number]>){
    WebGLApplication.webglApp.setPentagonPoints(points);
  }

  //0->1
  public setBrightness(value:number){
    WebGLApplication.webglApp.brightness = value;
  }

  public transitionToIntro(duration:number, onComplete:() => void){
    WebGLApplication.webglApp.transitionToIntro(duration, onComplete);
  }

  //3 colors
  public transitionTo(gradientColors:Color[], asset:Texture2D|string | null, duration:number, onComplete:() => void) {
    let photo: Texture2D | null = null;
    if(asset){
      photo = (typeof asset === 'string' || asset instanceof String) ? new TextureLoader(this.renderer, this.preloader, assetContext(asset as string), true) : asset;
    }

    WebGLApplication.webglApp.transitionTo(gradientColors, photo, duration, onComplete);
  }

  //amount along the x axs
  public setPixelCount(value:number){
    WebGLApplication.webglApp.pixelCount = value;
  }

  public setVideoElement(element:HTMLVideoElement| undefined){
    WebGLApplication.webglApp.setVideoElement(element);
  }

  public get renderer():Renderer{
    return WebGLApplication.webglApp.renderer;
  }

  public get preloader():WebGLPreLoader{
    return WebGLApplication.preloader;
  }

  //0-> 1. default is .5
  public setMouseEffectStrength(value:number){
    WebGLApplication.webglApp.setMouseEffectStrength(value);
  }

  public destruct() {
    WebGLApplication.externalControl?.destruct();
    WebGLApplication.webglApp.destruct();
  }

  private static addStats() {
    const script = document.createElement('script');
    script.onload = function () {
      // @ts-ignore
      const stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.bottom = '0px';
      stats.dom.style.top = '';
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    };
    script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
    document.head.appendChild(script);
  }
}
