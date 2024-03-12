import AbstractComponent from 'app/component/AbstractComponent';
import TrackingEvent from '../../../util/TrackingEvent';
export default class M05DownloadItem extends AbstractComponent {
  public static readonly displayName: string = 'm05-download-item';

  private download = this.getElement('[data-download]');

  constructor(el: HTMLElement) {
    super(el);
    this.download &&
      this.addDisposableEventListener(this.download, 'click', this.handleDownloadClick.bind(this));
  }

  public handleDownloadClick(): void {
    const eventTracking =
      this.element.dataset.eventTracking && JSON.parse(this.element.dataset.eventTracking);

    if (!eventTracking) {
      throw new Error('Event Tracking details cannot be found');
    }

    TrackingEvent(eventTracking);
  }
}
