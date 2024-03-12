import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C83InteractiveOverviewTransitionController from './C83InteractiveOverviewTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { MODAL } from '../../../util/overlayActionTypes';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { O09ModalCarouselContentProps } from 'app/component/organism/o09-modal-carousel-content/O09ModalCarouselContent.types';
const lazyO09Template = () =>
  import(
    '../../organism/o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;

import './c83-interactive-overview.scss';

export default class C83InteractiveOverview extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c83-interactive-overview';
  private app: App | null = null;
  private cardItemData = JSON.parse(<string>this.element.dataset.items);
  private cardItemButtons = this.getElements('[data-card-button]');

  public readonly transitionController: C83InteractiveOverviewTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C83InteractiveOverviewTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.cardItemButtons.forEach((item, index) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.onCardItemClick(index);
      });
    });

    if (this.app) {
      this.addDisposableEventListener(this.app.element, 'overlayAction', (event) => {
        if ((event as unknown as CustomEvent).detail.type === MODAL.CLOSE) {
          this.cardItemButtons
            .find((cardItemButton) => cardItemButton.classList.contains(StateClassNames.ACTIVE))
            ?.classList.remove(StateClassNames.ACTIVE);
        }
      });
    }
  }

  private async onCardItemClick(index: number): Promise<void> {
    this.cardItemButtons[index].classList.add(StateClassNames.ACTIVE);
    const data = {
      activeItemIndex: index,
      items: this.cardItemData,
      variant: 'fullBleedCarousel',
    };

    const template = await lazyO09Template();

    if (this.app && data) {
      this.app?.overlay?.dispatchAction({
        type: MODAL.STANDARD_DYNAMIC,
        payload: {
          template: template.default,
          data,
        },
      });
    }
  }
}
