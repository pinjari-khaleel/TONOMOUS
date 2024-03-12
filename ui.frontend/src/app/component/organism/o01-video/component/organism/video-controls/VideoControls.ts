import AbstractComponent from 'app/component/AbstractComponent';
import O01Video from '../../../O01Video';
import VideoEvent from '../../../event/VideoEvent';
import ProgressBar from '../../molecule/progress-bar/ProgressBar';
import TrackingEvent, { TrackingEventNames } from '../../../../../../util/TrackingEvent';
import { exitFullscreen, getFullscreenElement } from '../../../../../../util/fullscreenUtils';
import { isSafari } from '../../../../../../util/browserUtils';
import isEmpty from 'lodash/isEmpty';

export default class VideoControls extends AbstractComponent {
  public static readonly displayName: string = 'video-controls';

  private video: O01Video | null = null;
  private videoProgress: ProgressBar | null = null;

  private readonly playButton = this.getElement<HTMLButtonElement>('[data-video-play-button]');
  private readonly pauseButton = this.getElement<HTMLButtonElement>('[data-video-pause-button]');
  private readonly muteButton = this.getElement<HTMLButtonElement>('[data-video-mute-button]');
  private readonly unmuteButton = this.getElement<HTMLButtonElement>('[data-video-unmute-button]');
  private readonly enterFullscreenButton = this.getElement<HTMLButtonElement>(
    '[data-video-enter-fullscreen-button]',
  );
  private readonly exitFullscreenButton = this.getElement<HTMLButtonElement>(
    '[data-video-exit-fullscreen-button]',
  );
  private readonly videoControlsBar = this.getElement<HTMLButtonElement>(
    '[data-video-controls-bar]',
  )!;
  private readonly eventTrackingData = JSON.parse(this.element.dataset['eventTracking'] || '{}');

  private readonly playerProgressPercentTracking = {
    values: [25, 50, 75, 90, 100],
    start: true,
    last: 0,
  };

  constructor(el: HTMLElement) {
    super(el);

    this.addDisposableEventListener(this.element, 'click', this.toggleVideoPlayback.bind(this));
  }

  public adopted() {
    this.video = this.getClosestComponent<O01Video>('o01-video');
    this.videoProgress = this.getComponent<ProgressBar>('progress-bar');

    if (this.video == null) {
      throw new Error('this.video is empty');
    }

    if (this.videoProgress == null) {
      throw new Error('this.videoProgress is empty');
    }

    this.videoProgress?.disable();

    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.PLAYING,
      this.handlePlaying.bind(this),
    );

    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.PAUSE,
      this.handlePause.bind(this),
    );

    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.TIMEUPDATE,
      this.onTimeUpdate.bind(this),
    );

    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.LOADEDMETADATA,
      this.handleLoadedMetaData.bind(this),
    );

    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.VOLUMECHANGE,
      this.handleVolumeChange.bind(this),
    );

    this.playButton &&
      this.addDisposableEventListener(this.playButton, 'click', this.handlePlayClick.bind(this));

    this.pauseButton &&
      this.addDisposableEventListener(this.pauseButton, 'click', this.handlePauseClick.bind(this));

    this.muteButton &&
      this.addDisposableEventListener(this.muteButton, 'click', this.handleMuteClick.bind(this));

    this.unmuteButton &&
      this.addDisposableEventListener(
        this.unmuteButton,
        'click',
        this.handleUnmuteClick.bind(this),
      );

    this.enterFullscreenButton &&
      this.addDisposableEventListener(
        this.enterFullscreenButton,
        'click',
        this.handleFullscreenClick.bind(this),
      );

    this.exitFullscreenButton &&
      this.addDisposableEventListener(
        this.exitFullscreenButton,
        'click',
        this.handleFullscreenClick.bind(this),
      );

    this.toggleFullscreenButtons(false);

    if (this.pauseButton) this.pauseButton.style.display = 'none';

    // Set volume button state
    this.handleVolumeChange();
  }

  private async toggleVideoPlayback(event: MouseEvent) {
    if (this.video == null) {
      throw new Error('Video is undefined');
    }

    if (event.composedPath().includes(this.videoControlsBar)) {
      return;
    }

    if (await this.video.player.paused()) {
      this.video.player.play();
      !this.playerProgressPercentTracking.start && this.trackEvent(TrackingEventNames.VIDEO_START);
    } else {
      this.video.player.pause();
      this.trackEvent(TrackingEventNames.VIDEO_PAUSE);
    }
  }

  private async onTimeUpdate() {
    const currentTime = await this.video!.player.currentTime();

    const duration = await this.video!.player.duration();

    if (duration === undefined || currentTime === undefined) {
      return;
    }

    if (isEmpty(this.eventTrackingData)) {
      throw new Error('Could not find event tracking data.');
    }

    const progress = (currentTime / duration) * 100;

    const milestone = this.playerProgressPercentTracking.values
      .filter((trackingProgress) => progress >= trackingProgress)
      .pop();

    const playbackEnded = milestone === 100;
    const startPlayback = this.playerProgressPercentTracking.start;
    const lastMilestone = this.playerProgressPercentTracking.last;

    if (startPlayback) {
      this.playerProgressPercentTracking.start = false;

      this.trackEvent(TrackingEventNames.VIDEO_START);
    }

    if (milestone && lastMilestone !== milestone) {
      !isEmpty(this.eventTrackingData) &&
        TrackingEvent({
          event: TrackingEventNames.VIDEO_PROGRESS,
          video: {
            titleInEnglish: this.eventTrackingData.video.titleInEnglish,
            title: this.eventTrackingData.video.title,
            src: this.eventTrackingData.video.src,
            milestone: `${milestone}%`,
          },
        });

      this.playerProgressPercentTracking.last = milestone;
    }

    if (milestone === 100) {
      this.trackEvent(TrackingEventNames.VIDEO_COMPLETE);
    }

    if (playbackEnded && this.video?.player.clearTimeupdateInterval) {
      // PAUSE event won't fire for you tube videos after the ENDED event has already fired
      // (PAUSE event is used to trigger clearTimeupdateInterval in YouTubeVideo atom).
      // As such we need to call clearTimeupdateInterval here. Also cannot clear the interval
      // when the ENDED event fires because that would exclude the 100% milestone from firing.
      this.video?.player.clearTimeupdateInterval();
    }
  }

  private async handlePlayClick() {
    if (this.video == null) {
      throw new Error('Video is undefined');
    }

    await this.video.player.play();

    !isEmpty(this.eventTrackingData) && TrackingEvent(this.eventTrackingData);

    setTimeout(() => this.pauseButton?.focus(), 16);
  }

  private async handlePauseClick() {
    if (this.video == null) {
      throw new Error('Video is undefined');
    }

    await this.video.player.pause();

    this.trackEvent(TrackingEventNames.VIDEO_PAUSE);

    setTimeout(() => this.playButton?.focus(), 16);
  }

  private trackEvent(
    eventName:
      | TrackingEventNames.VIDEO_START
      | TrackingEventNames.VIDEO_PAUSE
      | TrackingEventNames.VIDEO_COMPLETE,
  ): void {
    !isEmpty(this.eventTrackingData) &&
      TrackingEvent({
        event: eventName,
        video: {
          titleInEnglish: this.eventTrackingData.video.titleInEnglish,
          title: this.eventTrackingData.video.title,
          src: this.eventTrackingData.video.src,
        },
      });
  }

  private async handleMuteClick() {
    if (this.video == null) {
      throw new Error('Video is undefined');
    }

    await this.video.player.setVolume(0);

    setTimeout(() => this.unmuteButton?.focus(), 16);
  }

  private async handleUnmuteClick() {
    if (this.video == null) {
      throw new Error('Video is undefined');
    }

    await this.video.player.setVolume(1);

    setTimeout(() => this.muteButton?.focus(), 16);
  }

  private async handleFullscreenClick() {
    if (this.video == null) {
      throw new Error('Video is undefined');
    }

    const fullscreenElement = getFullscreenElement();

    if (fullscreenElement === this.video.element) {
      if (isSafari()) {
        document.webkitExitFullscreen();
        return;
      }

      exitFullscreen();
      return;
    }

    this.video.requestFullscreen();
  }

  private handlePlaying() {
    if (this.playButton) this.playButton.style.display = 'none';
    if (this.pauseButton) this.pauseButton.style.display = 'flex';
  }

  private handlePause() {
    if (this.playButton) this.playButton.style.display = 'flex';
    if (this.pauseButton) this.pauseButton.style.display = 'none';
  }

  private async handleVolumeChange() {
    if (this.video == null) {
      throw new Error('Video is undefined');
    }

    const muted = (await this.video?.player.volume()) <= 0;

    if (this.muteButton) {
      this.muteButton.style.display = muted ? 'none' : 'flex';
    }

    if (this.unmuteButton) {
      this.unmuteButton.style.display = muted ? 'flex' : 'none';
    }
  }

  private handleLoadedMetaData() {
    if (this.video == null) {
      throw new Error('this.video is undefined');
    }

    const disabled =
      typeof this.video.props.controls === 'object'
        ? !this.video.props.controls.seek
        : !!this.video.props.controls;

    if (disabled) {
      this.videoProgress?.disable();
    } else {
      this.videoProgress?.enable();
    }
  }

  public toggleFullscreenButtons(isInFullscreen: boolean) {
    if (this.enterFullscreenButton && this.exitFullscreenButton) {
      this.enterFullscreenButton.style.display = isInFullscreen ? 'none' : 'flex';
      this.exitFullscreenButton.style.display = isInFullscreen ? 'flex' : 'none';
    }
  }
}
