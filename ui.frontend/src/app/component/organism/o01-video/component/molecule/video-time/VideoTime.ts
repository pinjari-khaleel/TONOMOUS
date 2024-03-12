import { secondsToDurationFormat, secondsToTimeString } from '../../../../../../util/stringUtils';
import AbstractComponent from '../../../../../AbstractComponent';
import O01Video from '../../../O01Video';
import VideoEvent from '../../../event/VideoEvent';

export default class VideoTime extends AbstractComponent {
  public static readonly displayName: string = 'video-time';

  private readonly currentTimeElement = this.element.querySelector<HTMLTimeElement>(
    '[data-current-time] time',
  );
  private readonly durationElement = this.element.querySelector<HTMLTimeElement>(
    '[data-duration] time',
  );

  private video: O01Video | null = null;
  public adopted() {
    this.video = this.getClosestComponent('o01-video');

    if (this.video == null) {
      throw new Error('O01Video is empty');
    }

    this.addDisposableEventListener(
      this.video.dispatcher,
      VideoEvent.TIMEUPDATE,
      this.handleTimeUpdate.bind(this),
    );
  }

  private async handleTimeUpdate() {
    if (this.video == null) {
      throw new Error('this.video is undefined');
    }

    if (this.currentTimeElement == null) {
      throw new Error('this.currentTimeElement is undefined');
    }

    if (this.durationElement == null) {
      throw new Error('this.durationElement is undefined');
    }

    const currentTime = await this.video.player.currentTime();
    const duration = await this.video.player.duration();

    if (currentTime == null || duration == null) {
      return;
    }

    const currentTimeInSeconds = currentTime;
    const durationInSeconds = duration;

    this.currentTimeElement.innerHTML = secondsToTimeString(currentTimeInSeconds);
    this.currentTimeElement.dateTime = secondsToDurationFormat(currentTimeInSeconds);

    this.durationElement.innerHTML = secondsToTimeString(durationInSeconds);
    this.durationElement.dateTime = secondsToDurationFormat(durationInSeconds);
  }
}
