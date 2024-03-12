import AbstractComponent from 'app/component/AbstractComponent';
import TrackingEvent, {
  TrackingEventActions,
  TrackingEventCategories,
  TrackingEventNames,
} from 'app/util/TrackingEvent';
import addRippleEffect from '../../../animation/addRippleEffect';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { VIDEO } from 'app/util/overlayActionTypes';
import { O01VideoProps } from 'app/component/organism/o01-video/O01Video.types';

const lazyO01Template = () =>
  import('../../organism/o01-video/o01-video.hbs?include') as LoadTemplateImport<O01VideoProps>;

export default class M02Button extends AbstractComponent {
  public static readonly displayName: string = 'm02-button';

  private eventTracking = this.element.dataset.eventTracking;
  private readonly buttonContainer: HTMLElement | null = this.getElement('[data-button-container]');
  private readonly videoData: O01VideoProps =
    this.element.dataset.video && JSON.parse(<string>this.element.dataset.video);

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted() {
    const enableRippleEffect =
      !this.element.classList.contains(`-tertiary`) &&
      !this.element.classList.contains(`-navigation`);
    enableRippleEffect &&
      this.disposables.add(addRippleEffect(<HTMLDivElement>this.buttonContainer));
    this.onCTAClick();

    this.app = await getAppComponent();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    if (this.videoData) {
      this.addDisposableEventListener(this.element, 'click', () => {
        this.onPlayClick();
      });
    }
  }

  private async onPlayClick(): Promise<void> {
    if (this.videoData) {
      const template = await lazyO01Template();
      const data = this.videoData;

      this.app &&
        this.videoData &&
        this.app.overlay?.dispatchAction({
          type: VIDEO.STANDARD_DYNAMIC,
          payload: {
            template: template.default,
            data,
          },
        });
    }
  }

  private onCTAClick() {
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
