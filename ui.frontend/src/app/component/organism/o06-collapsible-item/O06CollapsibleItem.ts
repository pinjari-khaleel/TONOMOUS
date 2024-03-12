import AbstractComponent from 'app/component/AbstractComponent';
import { Collapsible } from '../../../util/collapsible/Collapsible';
import CollapsibleEvent from '../../../util/collapsible/CollapsibleEvent';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import M14ToggleButton from '../../molecule/m14-toggle-button/M14ToggleButton';
import TrackingEvent, {
  TrackingEventActions,
  TrackingEventCategories,
  TrackingEventNames,
} from '../../../util/TrackingEvent';

export default class O06CollapsibleItem extends AbstractComponent {
  public static readonly displayName: string = 'o06-collapsible-item';

  private static readonly IS_EXPANDED: string = StateClassNames.EXPANDED;

  private eventTracking = this.element.dataset.eventTracking;
  private readonly contentElement = this.getElement('[data-collapsible-item-content]');
  private readonly toggleButton = this.getElement(
    `[data-component="${M14ToggleButton.displayName}"]`,
  );

  public readonly collapsible: Collapsible;

  private app: App | null = null;

  constructor(element: HTMLElement) {
    super(element);

    if (!this.contentElement) {
      throw new Error('The content element does not exist');
    }

    this.collapsible = new Collapsible(this.contentElement);
    this.collapsible.collapse(0);

    this.addDisposableEventListener(
      this.collapsible,
      CollapsibleEvent.EXPAND,
      this.handleCollapsibleExpand.bind(this),
    );

    this.addDisposableEventListener(
      this.collapsible,
      CollapsibleEvent.COLLAPSE,
      this.handleCollapsibleCollapse.bind(this),
    );

    this.addDisposableEventListener(
      this.collapsible,
      CollapsibleEvent.UPDATE_COMPLETE,
      this.handleCollapsibleUpdateComplete.bind(this),
    );

    this.addDisposableEventListener(this.collapsible, CollapsibleEvent.UPDATE, (event) =>
      this.dispatcher.dispatchEvent(event),
    );

    if (this.toggleButton) {
      this.addDisposableEventListener(
        this.toggleButton,
        'click',
        this.handleToggleButtonClick.bind(this),
      );
    }
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private handleCollapsibleCollapse(event: CollapsibleEvent): void {
    this.element.classList.remove(O06CollapsibleItem.IS_EXPANDED);
    this.dispatcher.dispatchEvent(event);
  }

  private handleCollapsibleExpand(event: CollapsibleEvent): void {
    this.element.classList.add(O06CollapsibleItem.IS_EXPANDED);
    this.dispatcher.dispatchEvent(event);
  }

  private handleCollapsibleUpdateComplete(event: CollapsibleEvent): void {
    this.dispatcher.dispatchEvent(event);
  }

  private handleToggleButtonClick(): void {
    if (this.collapsible) {
      this.collapsible.toggle();

      if (this.element.classList.contains(O06CollapsibleItem.IS_EXPANDED)) {
        this.eventTracking && this.trackAccordionButton();
      }
    }
  }

  private trackAccordionButton(): void {
    const buttonLabel = this.toggleButton?.querySelector('.a-label') as HTMLElement;
    if (buttonLabel) {
      if (this.eventTracking) {
        const eventTrackingObject = JSON.parse(this.eventTracking);

        TrackingEvent({
          event: TrackingEventNames.CLICK,
          eventLabel: buttonLabel ? buttonLabel.innerText : '',
          eventAction: eventTrackingObject.eventAction || TrackingEventActions.ACCORDION_CLICK,
          eventCategory: TrackingEventCategories.ACCORDION_DROPDOWN_MENU,
          componentId: eventTrackingObject.componentId || '',
        });
      }
    }
  }
}
