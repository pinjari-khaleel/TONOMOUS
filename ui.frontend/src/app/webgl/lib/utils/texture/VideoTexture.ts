import Texture2D from '../../renderer/texture/Texture2D';
import VideoPlayer from '../video/VideoPlayer';
import Renderer from '../../renderer/render/Renderer';
import TextureFormat from '../../renderer/texture/TextureFormat';
import Time from '../../renderer/core/Time';

export default class VideoTexture extends Texture2D {
  public videoPlayer: VideoPlayer;
  public copyFPS: number = 30;
  public manualUpdate: boolean = false;

  private lastUpdateTime: number = -1;

  constructor(
    renderer: Renderer,
    url: string,
    copyFPS: number = 30,
    filterLinear: boolean = true,
    wrapClamp: boolean = true,
    videoPlayer: VideoPlayer | null = null,
    play: boolean = true,
    loop: boolean = true,
  ) {
    super(renderer, TextureFormat.RGB_UNSIGNED_BYTE, false, filterLinear, wrapClamp);
    this.setSize(16, 16);

    this.copyFPS = copyFPS;
    this.videoPlayer = videoPlayer ? videoPlayer : new VideoPlayer(url);

    if (play) this.videoPlayer.play(loop ? -1 : 1);

    this.copyFrame();
  }

  public updateManual(forceUpdate: boolean = true) {
    this.manualUpdate = true;
    this.copyFrame(forceUpdate);
  }

  private copyRunningFrame(forceUpdate: boolean = false): void {
    const time = Time.instance.time;
    const elapsed = time - this.lastUpdateTime;

    if (elapsed >= 1 / this.copyFPS || forceUpdate) {
      this.videoPlayer.update(this);
      this.lastUpdateTime = time;
    }
  }

  public copyFrame(forceUpdate: boolean = false): void {
    this.copyRunningFrame(forceUpdate);

    if (!this.manualUpdate) {
      setTimeout(() => this.copyFrame(), 1000 / this.copyFPS);
    }
  }

  public destruct() {
    this.videoPlayer.destruct();
    super.destruct();
  }
}
