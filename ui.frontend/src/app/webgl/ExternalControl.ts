import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import DatGui from "mediamonks-webgl/utils/uiParams/DatGui";
import TextureLoader from "mediamonks-webgl/utils/loaders/TextureLoader";
import Color from "mediamonks-webgl/renderer/math/Color";
import Time from "mediamonks-webgl/renderer/core/Time";
import Tween from "mediamonks-webgl/utils/animation/Tween";
import WebGLApplication from "./WebGLApplication";

const assetContext = require.context(
  './data/',
  true,
  /\.png|\.webp|\.mp4|\.jpg$/
);

export default class ExternalControl {
  private application: WebGLApplication;
  private datGui: DatGui;
  private images: TextureLoader[] = [];
  private colorSets: Color[][] = [];
  private videoElement: HTMLVideoElement;
  private pentagonTween: Tween = new Tween<number>(0);

  constructor(application: WebGLApplication, preloader: WebGLPreLoader, ) {

    this.application = application;

    this.videoElement = this.initElement(assetContext('./panorama.mp4'));

    this.images.push(new TextureLoader(application.renderer, preloader, assetContext('./image0.webp'), true));
    this.images.push(new TextureLoader(application.renderer, preloader, assetContext('./image1.webp'), true));
    this.images.push(new TextureLoader(application.renderer, preloader, assetContext('./image2.webp'), true));

    this.colorSets.push([new Color(1,0,1), new Color(1,0,0), new Color(0,0,1)]);
    this.colorSets.push([new Color(.75,0.25,.75), new Color(.75,0,0.25), new Color(0.25,0,.75)]);
    this.colorSets.push([new Color(.5,0.25,1.), new Color(1.,0.25,0.25), new Color(0.25,0.25,1.)]);
    this.colorSets.push([Color.fromHex('#c4ffe1'), Color.fromHex('#fcfcfc'),Color.fromHex('#d7d7d7')]);

    this.datGui = new DatGui();
    let paramGroup: ParamGroup = new ParamGroup();
    paramGroup.init('external');
    paramGroup.addButton('transitionToIntro', ()=>{
      this.transitionToIntro();
    });
    for(let i = 0; i < this.images.length; i++){
      paramGroup.addButton('transitionTo'+i, ()=>this.application.transitionTo(this.colorSets[i], this.images[i], 2, ()=>{}));
    }
    paramGroup.addButton('transitionToNull', ()=>this.application.transitionTo(this.colorSets[0], null, 2, ()=>{}));
    paramGroup.addButton('transitionToGreen', ()=>this.application.transitionTo(this.colorSets[3], null, 2, ()=>{}));

    paramGroup.addParamBool('pentagon', false,(v)=>this.animatePentagonPoints(v));

    paramGroup.addParamFloat('_PixelCount', 48, 0, 128, (v)=>this.application.setPixelCount(v));

    paramGroup.addParamFloat('setMouseEffectStrength', .5, 0, 1, (v)=>this.application.setMouseEffectStrength(v));

    this.datGui.init(paramGroup);

    this.update();
  }

  public init(){
    this.transitionToIntro();
    this.setPentagonPoints(.5, 0, 0);
  }

  private transitionToIntro(){
    this.application.setVideoElement( this.videoElement );
    this.application.transitionToIntro(2, ()=>{});
  }

  private animatePentagonPoints(direction:boolean){
    this.pentagonTween.to(direction? 1 : 0, 2, (v)=>{
      this.setPentagonPoints(.5 + v * 2, 0, 0);
    })
  }

  private setPentagonPoints(radius:number, x = 0, y = 0) {
    const points: Array<[number, number]> = [];

    for(let i = 0; i < 5; i++){
      let phase = (i / 5) * Math.PI * 2;
      points[i] = [0, 0];

      if (i == 3) {
        radius *= 1.3;
        phase *= 1.085;
      }
      if (i == 4) {
        radius *= 1.05;
        phase *= 1.05;
      }

      points[i][0] = (x + (Math.sin(phase) * radius) / this.application.renderer.aspectRatio) * .5 + .5;
      points[i][1] = (y + Math.cos(phase) * radius) * .5 + .5;
    }

    this.application.setPentagonPoints(points);
  }

  public update(): void {

    const dt = Time.instance.deltaTime;
    this.pentagonTween.update(dt);

    window.requestAnimationFrame(() => this.update());
  }

  private initElement(url: string): HTMLVideoElement {
    const videoElement: HTMLVideoElement = document.createElement('video'); // new HTMLVideoElement('video');
    videoElement.setAttribute('playsinline', 'true');
    videoElement.setAttribute('webkit-playsinline', 'true');
    videoElement.setAttribute('autoplay', 'false');
    videoElement.preload = 'auto';
    videoElement.loop = false;
    videoElement.muted = true;
    videoElement.style.display = 'none';
    videoElement.autoplay = true;
    videoElement.addEventListener('canplay', () => {
      videoElement.play();
    }, true);
    videoElement.src = url;
    videoElement.load();
    if (videoElement.readyState > 3) {
      videoElement.play();
      // this.initVideo();
    }
    videoElement.loop = true;
    document.body.appendChild(videoElement);
    return videoElement;
  }

  public destruct() {
    this.datGui.destruct();
  }
}
