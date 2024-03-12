import Player from '@vimeo/player';
import { isIphoneOrIpod } from '../../../../../../util/browserUtils';
import AbstractVideo from '../../../AbstractVideo';
import VideoEvent, { VideoEventType } from '../../../event/VideoEvent';

const eventMap: Record<string, VideoEventType | Array<VideoEventType>> = {
  play: VideoEvent.PLAY,
  playing: VideoEvent.PLAYING,
  pause: VideoEvent.PAUSE,
  ended: VideoEvent.ENDED,
  timeupdate: VideoEvent.TIMEUPDATE,
  progress: VideoEvent.PROGRESS,
  seeking: VideoEvent.SEEKING,
  seeked: VideoEvent.SEEKED,
  volumechange: VideoEvent.VOLUMECHANGE,
  bufferstart: VideoEvent.LOADSTART,
  error: VideoEvent.ERROR,
  loaded: [VideoEvent.LOADEDDATA, VideoEvent.LOADEDMETADATA],
  durationchange: VideoEvent.DURATIONCHANGE,
};

export default class VimeoVideo extends AbstractVideo {
  public static readonly displayName: string = 'vimeo-video';

  private vimeoPlayer?: Player;

  public adopted() {
    super.adopted();

    if (this.video == null) {
      throw new Error('O01Video is empty');
    }

    this.vimeoPlayer = new Player(this.element, {
      controls: false,
      playsinline: !(this.video.props.controls && isIphoneOrIpod()),
      autoplay: this.video.props.autoplay || false,
      loop: this.video.props.loop || false,
      muted: this.video.props.muted || false,
      dnt: navigator.doNotTrack === '1',
      id: Number(this.video.props.vimeo),
      responsive: this.video.props.cover || false,
    });

    Object.keys(eventMap).forEach((key) => {
      if (this.vimeoPlayer == null) {
        return;
      }

      const eventNames = eventMap[key];
      const eventNameArray = Array.isArray(eventNames) ? eventNames : [eventNames];

      this.vimeoPlayer.on(key, () =>
        eventNameArray.forEach((eventName) => this.forwardEvent(eventName)),
      );
    });
  }

  public async duration(): Promise<number | undefined> {
    const duration = await this.vimeoPlayer?.getDuration();

    if (duration == null) {
      return duration;
    }

    return duration * 1000;
  }

  public async currentTime(): Promise<number | undefined> {
    const currentTime = await this.vimeoPlayer?.getCurrentTime();

    if (currentTime == null) {
      return currentTime;
    }

    return currentTime * 1000;
  }

  public async paused(): Promise<boolean> {
    return (await this.vimeoPlayer?.getPaused()) || false;
  }

  public async volume(): Promise<number> {
    const volume = await this.vimeoPlayer?.getVolume();

    if (volume == null) {
      return 1;
    }

    return volume;
  }

  public async play(): Promise<void> {
    await this.vimeoPlayer?.play();
  }

  public async pause(): Promise<void> {
    await this.vimeoPlayer?.pause();
  }

  public async setCurrentTime(time: number): Promise<void> {
    await this.vimeoPlayer?.setCurrentTime(time / 1000);
  }

  public async setVolume(volume: number): Promise<void> {
    await this.vimeoPlayer?.setVolume(volume);
  }
}
