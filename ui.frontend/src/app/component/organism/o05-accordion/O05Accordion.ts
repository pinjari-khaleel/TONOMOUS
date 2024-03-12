import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { getAppComponent } from '../../../util/getElementComponent';
import { TweenMax } from 'gsap';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import CollapsibleEvent from '../../../util/collapsible/CollapsibleEvent';
import O06CollapsibleItem from '../o06-collapsible-item/O06CollapsibleItem';
import O05AccordionTransitionController from './O05AccordionTransitionController';
import App from '../../layout/app/App';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

ScrollToPlugin;

export default class O05Accordion extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o05-accordion';

  public readonly transitionController: O05AccordionTransitionController;

  private CollapsibleItems: Array<O06CollapsibleItem> = [];
  private isMobile: boolean = false;
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O05AccordionTransitionController(this);

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );
  }

  public async adopted() {
    this.app = await getAppComponent();

    this.CollapsibleItems = this.getComponents<O06CollapsibleItem>(O06CollapsibleItem.displayName);
    this.CollapsibleItems.forEach((CollapsibleItem) => {
      this.addDisposableEventListener(
        CollapsibleItem.collapsible,
        CollapsibleEvent.EXPAND,
        this.collapseAllCollapsibleItems.bind(this),
      );
    });
  }

  public collapseAllCollapsibleItems(event: CollapsibleEvent) {
    this.CollapsibleItems.forEach((CollapsibleItem) => {
      if (!CollapsibleItem.element.contains(event.collapsible.expandedItemContent)) {
        CollapsibleItem.collapsible.collapse();
      }
    });
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.SMALL;
  }
}
