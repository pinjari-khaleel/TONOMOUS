import TrackingEvent, {
  TrackingEventActions,
  TrackingEventCategories,
  TrackingEventNames,
} from '../../../util/TrackingEvent';
import AbstractComponent from '../../AbstractComponent';

export default class M53TileCta extends AbstractComponent {
  public static readonly displayName: string = 'm53-tile-cta';

  private eventTracking = this.element.dataset.eventTracking;

  public adopted() {
    this.addDisposableEventListener(this.element, 'click', () => {
      this.eventTracking && this.trackCTA();
    });
  }

  private trackCTA(): void {
    const buttonLabel = this.element.querySelector('.a-label') as HTMLElement;
    if (this.eventTracking) {
      const eventTrackingObject = JSON.parse(this.eventTracking);
      TrackingEvent({
        event: TrackingEventNames.CLICK,
        eventLabel: buttonLabel ? buttonLabel.innerText : '',
        eventAction: TrackingEventActions.CTA_CLICK,
        eventCategory: TrackingEventCategories.CTA,
        ctaId: eventTrackingObject.ctaId || '',
      });
    }
  }
}
