import { isIphoneOrIpod } from '../../../../../../util/browserUtils';
import AbstractVideo from '../../../AbstractVideo';
import VideoEvent, { VideoEventType } from '../../../event/VideoEvent';

const eventMap: Record<string, VideoEventType> = {
  abort: VideoEvent.ABORT,
  canplay: VideoEvent.CANPLAY,
  canplaythrough: VideoEvent.CANPLAYTHROUGH,
  durationchange: VideoEvent.DURATIONCHANGE,
  emptied: VideoEvent.EMPTIED,
  ended: VideoEvent.ENDED,
  error: VideoEvent.ERROR,
  loadeddata: VideoEvent.LOADEDDATA,
  loadedmetadata: VideoEvent.LOADEDMETADATA,
  loadstart: VideoEvent.LOADSTART,
  pause: VideoEvent.PAUSE,
  play: VideoEvent.PLAY,
  playing: VideoEvent.PLAYING,
  progress: VideoEvent.PROGRESS,
  ratechange: VideoEvent.RATECHANGE,
  seeked: VideoEvent.SEEKED,
  seeking: VideoEvent.SEEKING,
  stalled: VideoEvent.STALLED,
  suspend: VideoEvent.SUSPEND,
  timeupdate: VideoEvent.TIMEUPDATE,
  volumechange: VideoEvent.VOLUMECHANGE,
  waiting: VideoEvent.WAITING,
};

export default class NativeVideo extends AbstractVideo {
  public static readonly displayName: string = 'native-video';

  constructor(el: HTMLElement) {
    super(el);

    Object.keys(eventMap).forEach((key) => {
      this.addDisposableEventListener(
        this.element,
        key,
        this.forwardEvent.bind(this, eventMap[key]),
      );
    });
  }

  public adopted() {
    super.adopted();

    if (this.video == null) {
      throw new Error('O01Video is empty');
    }

    if (this.video.props.controls && isIphoneOrIpod()) {
      this.element.removeAttribute('playsinline');
    }
  }

  public async duration() {
    const element = this.element as HTMLVideoElement;
    return element.duration;
  }

  public async currentTime() {
    const element = this.element as HTMLVideoElement;
    return element.currentTime;
  }

  public async paused() {
    const element = this.element as HTMLVideoElement;
    return element.paused;
  }

  public async volume() {
    const element = this.element as HTMLVideoElement;
    return element.volume;
  }

  public async play(): Promise<void> {
    const element = this.element as HTMLVideoElement;
    element.play();
  }

  public async pause(): Promise<void> {
    const element = this.element as HTMLVideoElement;
    element.pause();
  }

  public async setCurrentTime(time: number): Promise<void> {
    const element = this.element as HTMLVideoElement;
    element.currentTime = time;
  }

  public async setVolume(volume: number): Promise<void> {
    const element = this.element as HTMLVideoElement;
    element.volume = volume;
  }
}
