import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C87CardCarouselTransitionController from './C87CardCarouselTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { toggleControlsVisibility } from '../../../util/swiper/toggleControlsVisibility';
import Swiper, { Navigation, Pagination } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import { VIDEO } from '../../../util/overlayActionTypes';
import { O01VideoProps } from 'app/component/organism/o01-video/O01Video.types';

import './c87-card-carousel.scss';

const lazyO01Template = () =>
  import('../../organism/o01-video/o01-video.hbs?include') as LoadTemplateImport<O01VideoProps>;

export default class C87CardCarousel extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c87-card-carousel';
  private app: App | null = null;
  private swiper!: Swiper;
  private readonly slider = this.getElement('[data-slider]');
  private readonly slideButtons = this.getElements('[ data-slide-button]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly controls = this.getElement('[data-controls]');

  public readonly transitionController: C87CardCarouselTransitionController;

  private inSwipe = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C87CardCarouselTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.addEventListeners();
    this.initSlider();
    toggleControlsVisibility(this.controls, this.previousButton, this.nextButton);
    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(window, 'resize', () =>
      toggleControlsVisibility(this.controls, this.previousButton, this.nextButton),
    );

    this.slideButtons.forEach((item, index) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.onCardItemClick(index);
      });
    });
  }

  private initSlider(): void {
    Swiper.use([Navigation, Pagination]);

    if (this.slider) {
      this.swiper = new Swiper(this.slider, {
        loop: false,
        direction: 'horizontal',
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 23,
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
        on: {
          touchMove: () => {
            this.inSwipe = true;
          },
          touchEnd: () => {
            setTimeout(() => {
              this.inSwipe = false;
            }, 200);
          },
        },
        breakpoints: {
          480: {
            spaceBetween: 32,
          },
          768: {
            spaceBetween: 54,
            freeMode: true,
            freeModeMinimumVelocity: 0.02,
            threshold: 5,
          },
          1024: {
            spaceBetween: 72,
            centeredSlides: false,
          },
        },
      });
    }
  }

  private async onCardItemClick(index: number): Promise<void> {
    const data =
      this.slideButtons[index].dataset.video &&
      JSON.parse(<string>this.slideButtons[index].dataset.video);

    const template = await lazyO01Template();

    this.app &&
      data &&
      this.app.overlay?.dispatchAction({
        type: VIDEO.STANDARD_DYNAMIC,
        payload: {
          template: template.default,
          data,
        },
      });
  }
}
