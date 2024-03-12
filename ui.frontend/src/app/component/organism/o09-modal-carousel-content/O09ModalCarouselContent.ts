import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O09ModalCarouselContentTransitionController from './O09ModalCarouselContentTransitionController';
import Swiper, { Navigation, Pagination } from 'swiper';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import O10Modal from 'app/component/organism/o10-modal/O10Modal';
import { getAppComponent } from 'app/util/getElementComponent';
import { getComponentForElement } from 'muban-core';
import { O09ModalCarouselContentProps } from './O09ModalCarouselContent.types';
import { isRtl } from '../../../util/rtlUtils';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class O09ModalCarouselContent extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o09-modal-carousel-content';

  public readonly transitionController: O09ModalCarouselContentTransitionController;

  private readonly slider = this.getElement('[data-slider]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly sliderItems = this.getElements('[data-slider-item]');
  private readonly sliderItem = this.sliderItems[0];
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly props: O09ModalCarouselContentProps =
    this.element.dataset.props && JSON.parse(this.element.dataset.props);
  private modal: O10Modal | null = null;
  private swiperSlider: Swiper | undefined = undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O09ModalCarouselContentTransitionController(this);

    this.initSlider();
  }

  public async adopted(): Promise<void> {
    setAsInitialised(this.element);

    const app = await getAppComponent();

    const modal = app.getElement(`[data-component="${O10Modal.displayName}"]`);

    if (modal) {
      this.modal = getComponentForElement<O10Modal>(modal);
    }

    // reassign listeners to 'previous modal buttons' since
    // swiper instance creates dupliacate slides for which
    // the previous modal buttons would not have an assigned listener
    this.modal?.assignPreviousModalButtons();
  }

  public async initSlider(): Promise<void> {
    this.destroySlider();

    const activeItemIndex = this.props && this.props.activeItemIndex;

    if (this.slider) {
      Swiper.use([Navigation, Pagination]);

      this.swiperSlider = new Swiper(this.slider, {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        spaceBetween: 40,
        navigation: {
          nextEl: isRtl() ? this.previousButton : this.nextButton,
          prevEl: isRtl() ? this.nextButton : this.previousButton,
        },
        pagination: {
          bulletClass: 'a-pageIndicator',
          bulletElement: 'span',
          bulletActiveClass: StateClassNames.ACTIVE,
          currentClass: StateClassNames.ACTIVE,
          el: this.pagination,
          type: 'bullets',
        },
        breakpoints: {
          768: {
            spaceBetween: this.sliderItem.offsetWidth,
          },
        },
        noSwipingClass: 'o-modalCarouselContent__previousModalButton',
        initialSlide: activeItemIndex,
      });
    }
  }

  private destroySlider() {
    if (this.swiperSlider) {
      this.swiperSlider.destroy();
    }
  }

  public dispose() {
    super.dispose();
    this.disposables.dispose();
    this.destroySlider();
  }
}
