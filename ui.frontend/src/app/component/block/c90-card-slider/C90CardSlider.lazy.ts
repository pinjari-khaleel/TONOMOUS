import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { getAppComponent } from 'app/util/getElementComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { toggleControlsVisibility } from 'app/util/swiper/toggleControlsVisibility';
import Swiper, { Navigation, Pagination } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import C90CardSliderTransitionController from './C90CardSliderTransitionController';

import './c90-card-slider.scss';

export default class C90CardSlider extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c90-card-slider';

  public readonly transitionController: C90CardSliderTransitionController;

  private readonly slider = this.getElement('[data-slider]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly controls = this.getElement('[data-controls]');

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new C90CardSliderTransitionController(this);

    this.addEventListeners();
    this.initSlider();
    toggleControlsVisibility(this.controls, this.previousButton, this.nextButton);
  }

  public async adopted() {
    setAsInitialised(this.element);
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(window, 'resize', () =>
      toggleControlsVisibility(this.controls, this.previousButton, this.nextButton),
    );
  }

  private initSlider(): void {
    Swiper.use([Navigation, Pagination]);

    if (this.slider == null) {
      throw new Error('this.slider cannot be empty');
    }

    new Swiper(this.slider, {
      loop: false,
      direction: 'horizontal',
      slidesPerView: 'auto',
      spaceBetween: 30,
      navigation: {
        disabledClass: StateClassNames.DISABLED,
        nextEl: this.nextButton,
        prevEl: this.previousButton,
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
          spaceBetween: 70,
          freeMode: true,
          freeModeMinimumVelocity: 0.02,
          threshold: 5,
        },
      },
    });
  }

  public dispose() {
    super.dispose();
  }
}
