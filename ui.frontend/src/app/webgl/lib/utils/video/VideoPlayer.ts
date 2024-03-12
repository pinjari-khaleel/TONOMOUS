import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';

export default class VideoPlayer {
  public readonly videoElement: HTMLVideoElement;
  private _initialized: boolean = false;
  private _playRequested: boolean = false;
  private _playPromiseLock: boolean = false;
  private _updatePossible: boolean = false;
  private _paused: boolean = true;
  private _videoCounter: number = 0;
  private _videoCounterPlayed: number = 0;
  private initCallback: (() => void) | null = null;

  constructor(url: string) {
    this.videoElement = this.initElement(url);
    this.videoElement.addEventListener('ended', () => {
      if (!this._paused) {
        this._videoCounterPlayed++;
        if (this._videoCounter > 0) {
          if (this._videoCounterPlayed < this._videoCounter) {
            const videoElement = <HTMLVideoElement>this.videoElement;
            videoElement.currentTime = 0;
            videoElement.play();
          } else {
            this.pause();
          }
        }
      }
    });
  }

  public addInitCallback(callback: () => void) {
    this.initCallback = callback;
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
    videoElement.autoplay = false;
    videoElement.addEventListener('canplay', () => this.initVideo(), true);
    videoElement.src = url;
    videoElement.load();
    if (videoElement.readyState > 3) {
      this.initVideo();
    }
    document.body.appendChild(videoElement);
    return videoElement;
  }

  public initVideo() {
    if (this._initialized) {
      return;
    }
    const videoElement = <HTMLVideoElement>this.videoElement;
    videoElement.width = videoElement.videoWidth;
    videoElement.height = videoElement.videoHeight;
    this._initialized = true;
    if (this.initCallback) {
      this.initCallback();
      this.initCallback = null;
    }
  }

  public initialized(): boolean {
    return this._initialized;
  }

  public get paused(): boolean {
    return this._paused;
  }

  public play(loop: number = -1, fromStart: boolean = true) {
    this._videoCounter = loop;
    this._videoCounterPlayed = 0;
    const videoElement = <HTMLVideoElement>this.videoElement;
    videoElement.loop = loop > 0 ? false : true;
    if (fromStart) videoElement.currentTime = 0;
    this._playRequested = true;
    this._updatePossible = false;
    this._paused = false;
  }

  public pause() {
    if (this._paused) {
      return;
    }
    if (this._playPromiseLock) {
      return;
    }
    this._paused = true;
    const videoElement = <HTMLVideoElement>this.videoElement;
    // console.log('pause video');
    videoElement.pause();
  }

  public update(texture: Texture2D): boolean {
    if (!this._initialized) {
      return false;
    }
    const videoElement = <HTMLVideoElement>this.videoElement;
    if (this._playRequested && !this._paused) {
      this._playRequested = false;
      this._playPromiseLock = true;
      // console.log('play video');
      videoElement.play().then(() => {
        this._updatePossible = true;
        this._playPromiseLock = false;
      });
    }
    if (this._updatePossible && !this._paused && videoElement.readyState > 1) {
      texture.setImage(videoElement);
      return true;
    }
    return false;
  }

  destruct() {
    document.body.removeChild(<HTMLVideoElement>this.videoElement);
  }
}
