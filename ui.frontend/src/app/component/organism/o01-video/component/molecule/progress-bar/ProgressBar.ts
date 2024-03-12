import AbstractComponent from 'app/component/AbstractComponent';
import clamp from 'lodash/clamp';
import isEmpty from 'lodash/isEmpty';

import { secondsToTimeString } from '../../../../../../util/stringUtils';
import O01Video from '../../../O01Video';
import VideoEvent from '../../../event/VideoEvent';
import A09TimeIndicator from 'app/component/atom/a09-time-indicator/A09TimeIndicator';
import TrackingEvent, { TrackingEventNames } from '../../../../../../util/TrackingEvent';

export default class ProgressBar extends AbstractComponent {
  public static readonly displayName: string = 'progress-bar';

  private readonly currentProgress = this.getElement('[data-current-progress-bar]');
  private readonly selectedProgress = this.getElement('[data-selected-progress-bar]');
  private readonly timeIndicator = this.getElement(
    `[data-component="${A09TimeIndicator.displayName}"]`,
  );
  private readonly eventTrackingData = JSON.parse(
    this.element.parentElement?.parentElement?.dataset['eventTracking'] || '{}',
  );

  private video: O01Video | null = null;
  private mouseMoveRaf: number = 0;

  constructor(el: HTMLElement) {
    super(el);
    this.addDisposableEventListener(this.element, 'mousemove', this.handleMouseMove.bind(this));
    this.addDisposableEventListener(this.element, 'mousedown', this.handleMouseDown.bind(this));
  }

  public adopted() {
    this.video = this.getClosestComponent('o01-video');
    if (this.video == null) {
      throw new Error('this.video is empty');
    }

    this.addDisposableEventListener(document, 'keydown', this.handleKeyDown.bind(this));
    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.TIMEUPDATE,
      this.handleTimeUpdate.bind(this),
    );
  }

  private handleTrackingEvent() {
    !isEmpty(this.eventTrackingData) &&
      TrackingEvent({
        event: TrackingEventNames.VIDEO_SEEK,
        video: {
          titleInEnglish: this.eventTrackingData.video.titleInEnglish,
          title: this.eventTrackingData.video.title,
          src: this.eventTrackingData.video.src,
        },
      });
  }

  /**
   * Enable seeking state
   */
  protected handleMouseDown() {
    if (this.element.classList.contains('-isDisabled')) {
      return;
    }

    this.element.classList.toggle('-isSeeking', true);
    document.addEventListener('mouseup', this.handleMouseUp);

    this.handleTrackingEvent();
  }

  /**
   * Update current time and remove old event listeners
   * @param event
   */
  protected handleMouseUp = async (event: MouseEvent) => {
    document.removeEventListener('mouseup', this.handleMouseUp);

    if (this.video == null) {
      throw new Error('this.video is undefined');
    }

    const duration = await this.video?.player.duration();

    if (duration == null) {
      throw new Error('duration is undefined');
    }

    const clientRect = this.element.getBoundingClientRect();
    const offsetPercentage = clamp((event.pageX - clientRect.left) / clientRect.width, 0, 1);

    this.video.player.setCurrentTime(duration * offsetPercentage);
    this.element.classList.toggle('-isSeeking', false);
  };

  /**
   * Throttle mouse move event using requestAnimationFrame
   * @param event
   */
  protected handleMouseMove(event: MouseEvent) {
    cancelAnimationFrame(this.mouseMoveRaf);
    this.mouseMoveRaf = requestAnimationFrame(this.handleMouseMoveRaf.bind(this, event));
  }

  /**
   * Update suggestion bar and time indicator on mouse move
   * @param event
   */
  protected async handleMouseMoveRaf(event: MouseEvent) {
    if (this.selectedProgress == null) {
      throw new Error('this.selectedProgress is empty');
    }

    if (this.timeIndicator == null) {
      throw new Error('this.timeIndicator is empty');
    }

    if (this.currentProgress == null) {
      throw new Error('this.currentProgress is empty');
    }

    const duration = await this.video?.player.duration();

    if (duration == null) {
      throw new Error('duration is undefined');
    }

    const clientRect = this.element.getBoundingClientRect();
    const offsetPercentage = clamp((event.pageX - clientRect.left) / clientRect.width, 0, 1);
    const formattedVideoProgress = secondsToTimeString(offsetPercentage * duration);
    // Always update
    this.selectedProgress.style.transform = `scaleX(${offsetPercentage})`;
    this.timeIndicator.style.left = `${offsetPercentage * 100}%`;
    this.timeIndicator.innerHTML = duration ? formattedVideoProgress : '0:00';

    // Update current time position when seeking
    if (!this.element.classList.contains('-isSeeking')) {
      return;
    }

    this.currentProgress.style.transform = `scaleX(${offsetPercentage})`;
  }

  protected async handleTimeUpdate() {
    if (this.element.classList.contains('-isSeeking')) {
      return;
    }

    if (this.currentProgress == null) {
      throw new Error('this.currentProgress is empty');
    }

    const currentTime = await this.video?.player.currentTime();
    const duration = await this.video?.player.duration();

    if (currentTime == null || duration == null) {
      throw new Error('currentTime or duration is undefined');
    }

    const ratio = currentTime / duration;
    this.currentProgress.style.transform = `scaleX(${ratio})`;
  }

  private async handleKeyDown(event: KeyboardEvent) {
    if (this.video?.element.contains(document.activeElement)) {
      return;
    }

    if (this.element.classList.contains('-isDisabled')) {
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const currentTime = await this.video?.player.currentTime();

      if (currentTime != null) {
        this.video?.player.setCurrentTime(currentTime + (event.key === 'ArrowLeft' ? -5000 : 5000));
      }

      this.handleTrackingEvent();
    }
  }

  public enable() {
    this.element.classList.toggle('-isDisabled', false);
  }

  public disable() {
    this.element.classList.toggle('-isDisabled', true);
  }
}
