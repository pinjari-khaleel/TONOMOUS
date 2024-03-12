import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C82CardListTransitionController from './C82CardListTransitionController';
import App from '../../layout/app/App';
import { getAppComponent } from 'app/util/getElementComponent';
import { MODAL } from 'app/util/overlayActionTypes';
import { O09ModalCarouselContentProps } from 'app/component/organism/o09-modal-carousel-content/O09ModalCarouselContent.types';
const lazyO09Template = () =>
  import(
    '../../organism/o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;
export default class C82CardList extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c82-card-list';

  private app: App | null = null;
  private cardListItems = this.getElements('[data-item]');

  private cardItemData = JSON.parse(<string>this.element.dataset.items);

  public readonly transitionController: C82CardListTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C82CardListTransitionController(this);
    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.cardListItems.forEach((item, index) => {
      this.addDisposableEventListener(item, 'mouseenter', () => {
        this.onMouseEnterItem(index);
      });
    });

    this.cardListItems.forEach((item, index) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.onCardItemClick(index);
      });
    });

    this.cardListItems.forEach((item) => {
      this.addDisposableEventListener(item, 'mouseout', () => {
        this.onMouseOutItem();
      });
    });
  }

  private onMouseEnterItem(index: number): void {
    if (this.app === null) throw new Error('App was not found');
    this.app.transformCursor(true, 'arrow-right', 'outlinedCursorPurple');
  }

  private async onCardItemClick(index: number): Promise<void> {
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

  private onMouseOutItem(): void {
    if (this.app === null) throw new Error('App was not found');
    this.app.transformCursor(false);
  }
}
