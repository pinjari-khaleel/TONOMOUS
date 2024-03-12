import YouTubePlayer from 'youtube-player';
import { YouTubePlayer as YouTubePlayerType } from 'youtube-player/dist/types';
import { isIphoneOrIpod } from '../../../../../../util/browserUtils';
import AbstractVideo from '../../../AbstractVideo';
import VideoEvent, { VideoEventType } from '../../../event/VideoEvent';

if (process.env.NODE_ENV === 'development') {
  localStorage.setItem('debug', 'youtube-player:*');
}

const stateToVideoEvent: Record<number, VideoEventType> = {
  [-1]: VideoEvent.LOADSTART,
  [0]: VideoEvent.ENDED,
  [1]: VideoEvent.PLAYING,
  [2]: VideoEvent.PAUSE,
  [3]: VideoEvent.LOADSTART,
};

export default class YoutubeVideo extends AbstractVideo {
  public static readonly displayName: string = 'youtube-video';

  private youTubePlayer?: YouTubePlayerType;
  private timeUpdateInterval?: number;

  public async adopted() {
    super.adopted();

    if (this.video == null) {
      throw new Error('O01Video is empty');
    }

    if (this.video.props.youtube == null) {
      throw new Error('Empty video id');
    }

    this.youTubePlayer = YouTubePlayer(
      this.element,
      {
        videoId: this.video.props.youtube,
        playerVars: {
          autoplay: 0,
          loop: this.video.props.loop ? 1 : 0,
          controls: 0,
          disablekb: 1,
          playsinline: this.video.props.controls && isIphoneOrIpod() ? 0 : 1,
          modestbranding: 1,
          rel: 0,
        },
      },
      true,
    );

    if (this.video.props.autoplay) {
      this.youTubePlayer.playVideo();
    }

    if (this.video.props.muted) {
      this.youTubePlayer.mute();
    } else {
      this.youTubePlayer.unMute();
    }

    this.youTubePlayer.on('stateChange', this.handleStateChange.bind(this));
    this.youTubePlayer.on('ready', this.handleReady.bind(this));

    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.PLAYING,
      this.handlePlay.bind(this),
    );

    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.PAUSE,
      this.clearTimeupdateInterval.bind(this),
    );
  }

  public handlePlay() {
    clearInterval(this.timeUpdateInterval);
    this.timeUpdateInterval = setInterval(() => {
      this.video?.dispatcher.dispatchEvent(new VideoEvent(VideoEvent.TIMEUPDATE));
    }, 250);
  }

  public clearTimeupdateInterval(): void {
    clearInterval(this.timeUpdateInterval);
  }

  public async duration() {
    if (this.youTubePlayer == null) {
      return undefined;
    }

    // getDuration *is a* promise!
    return (await this.youTubePlayer.getDuration()) * 1000;
  }

  public async currentTime() {
    if (this.youTubePlayer == null) {
      return undefined;
    }

    // getCurrentTime *is a* promise!
    return (await this.youTubePlayer.getCurrentTime()) * 1000;
  }

  public async paused(): Promise<boolean> {
    // getPlayerState *is a* promise!
    return (await this.youTubePlayer?.getPlayerState()) !== 1;
  }

  public async volume(): Promise<number> {
    // isMuted *is a* promise!
    const muted = await this.youTubePlayer?.isMuted();

    if (muted) {
      return 0;
    }

    // getVolume *is a* promise!
    const volume = await this.youTubePlayer?.getVolume();

    if (volume == null) {
      return 1;
    }

    // getVolume *is a* promise!
    return volume / 100;
  }

  public async play(): Promise<void> {
    this.youTubePlayer?.playVideo();
  }

  public async pause(): Promise<void> {
    this.youTubePlayer?.pauseVideo();
  }

  public async setCurrentTime(time: number) {
    this.youTubePlayer?.seekTo(time / 1000, true);
  }

  public async setVolume(volume: number): Promise<void> {
    await this.youTubePlayer?.setVolume(volume * 100);

    return new Promise((resolve) => {
      setTimeout(() => {
        this.video?.dispatcher.dispatchEvent(new VideoEvent(VideoEvent.VOLUMECHANGE));

        resolve();
      }, 100);
    });
  }

  /**
   * -1 - Unstarted
   * 0 - Ended
   * 1 - Playing
   * 2 - Paused
   * 3 - Buffering
   * 5 - Video cued
   */
  private handleStateChange(event: CustomEvent & { data: number }) {
    const eventType: string | undefined = stateToVideoEvent[event.data];
    if (eventType) {
      this.video?.dispatcher.dispatchEvent(new VideoEvent(eventType));
      return;
    }
  }

  private handleReady() {
    this.video?.dispatcher.dispatchEvent(new VideoEvent(VideoEvent.LOADEDMETADATA));
  }

  public dispose() {
    this.youTubePlayer?.destroy();
  }
}
