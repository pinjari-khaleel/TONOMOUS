import AbstractComponent from 'app/component/AbstractComponent';
import TrackingEvent, {
  TrackingEventActions,
  TrackingEventCategories,
  TrackingEventNames,
} from 'app/util/TrackingEvent';

export default class M58PillarCta extends AbstractComponent {
  public static readonly displayName: string = 'm58-pillar-cta';

  private eventTracking = this.element.dataset.eventTracking;

  public adopted() {
    this.addDisposableEventListener(this.element, 'click', this.trackCTA);
  }

  private trackCTA(): void {
    if (this.eventTracking) {
      const ctaLabel = this.getElement<HTMLSpanElement>('.m-pillarCta__label');
      const eventTrackingObject = JSON.parse(this.eventTracking);
      TrackingEvent({
        event: TrackingEventNames.CLICK,
        eventLabel: ctaLabel ? ctaLabel.innerText : '',
        eventAction: TrackingEventActions.CTA_CLICK,
        eventCategory: TrackingEventCategories.CTA,
        ctaId: eventTrackingObject.ctaId || '',
      });
    }
  }
}
