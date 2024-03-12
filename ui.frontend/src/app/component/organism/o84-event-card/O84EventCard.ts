import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { getAppComponent } from '../../../util/getElementComponent';
import { MODAL } from '../../../util/overlayActionTypes';
import App from '../../layout/app/App';
import { O09ModalCarouselContentProps } from '../o09-modal-carousel-content/O09ModalCarouselContent.types';
import O84EventCardTransitionController from './O84EventCardTransitionController';
const lazyO09Template = () =>
  import(
    '../../organism/o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;
export default class O84EventCard extends AbstractTransitionComponent {
  public static readonly displayName = 'o84-event-card';

  public readonly transitionController: O84EventCardTransitionController;

  private _modalData = this.element.dataset.modal ? JSON.parse(this.element.dataset.modal) : {};
  public get modalData() {
    return this._modalData;
  }

  private app: App | undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O84EventCardTransitionController(this);
    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private addEventListeners() {
    this.element.addEventListener('click', this.onClick.bind(this));
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  private async onClick() {
    if (this.app == null) {
      throw new Error();
    }

    const eventCards = this.getComponents<O84EventCard>(
      O84EventCard.displayName,
      this.app?.element,
    );

    const items = eventCards.map((eventCard) => ({
      content: eventCard.modalData,
    }));

    const activeItemIndex = eventCards.findIndex((eventCard) => eventCard.element === this.element);

    const template = await lazyO09Template();
    const data = {
      items,
      activeItemIndex,
      variant: 'fullBleedCarousel',
    };

    this.app?.overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: template.default,
        data,
      },
    });
  }

  private onMouseEnter() {
    this.app?.transformCursor(true, 'arrow-right', 'outlinedCursorGreen');
  }

  private onMouseLeave() {
    this.app?.transformCursor(false);
  }
}
