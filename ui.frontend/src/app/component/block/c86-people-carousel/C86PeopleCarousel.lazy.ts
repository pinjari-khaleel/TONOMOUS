import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C86PeopleCarouselTransitionController from './C86PeopleCarouselTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import Draggable from 'gsap/Draggable';
import ThrowPropsPlugin from '../../../vendor/gsap/ThrowPropsPlugin';
import { TweenMax, Power2 } from 'gsap';
import debounce from 'lodash/debounce';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import eases from '../../../animation/eases';
import { isRtl } from '../../../util/rtlUtils';

import './c86-people-carousel.scss';

export default class C86PeopleCarousel extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c86-people-carousel';
  public readonly transitionController: C86PeopleCarouselTransitionController;
  private readonly carousel = this.getElement('[data-carousel]') as HTMLElement;
  private readonly carouselItems = this.getElements('[data-carousel-item]');
  private readonly paginationItems = this.getElements('[data-pagination]');
  private readonly previousButton: HTMLButtonElement = this.getElement(
    '[data-previous-button]',
  ) as HTMLButtonElement;
  private readonly nextButton: HTMLButtonElement = this.getElement(
    '[data-next-button]',
  ) as HTMLButtonElement;
  private readonly carouselControls = this.getElement('[data-controls]') as HTMLElement;
  private dragger!: Draggable;
  private currentItem: number = 0;
  private itemWidth: number = 0;
  private visibleCount: number = 0;
  private itemTotalCount: number = 0;
  private isRtlDirection: boolean = isRtl();

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C86PeopleCarouselTransitionController(this);
    ThrowPropsPlugin;
  }

  public async adopted() {
    setTimeout(() => {
      setAsInitialised(this.element);
      this.itemWidth = this.carouselItems[0] && this.carouselItems[0].clientWidth;
      this.itemTotalCount = this.carouselItems.length;

      this.carouselItems.forEach((item, index) => {
        const contentWrapper = item.querySelector('[data-card-content]');
        if (contentWrapper && index !== this.currentItem) {
          TweenMax.set(contentWrapper.children, {
            autoAlpha: 0,
          });
        }
      });

      if (this.previousButton) {
        this.previousButton.disabled = true;
      }

      this.addEventListeners();
      this.initCarousel();
    });
  }

  private addEventListeners(): void {
    if (this.previousButton && this.nextButton) {
      this.addDisposableEventListener(this.previousButton, 'click', () =>
        this.animateTo(this.currentItem - 1),
      );
      this.addDisposableEventListener(this.nextButton, 'click', () =>
        this.animateTo(this.currentItem + 1),
      );
    }
    this.addDisposableEventListener(window, 'resize', debounce(this.handleResize.bind(this), 300));
    this.carouselItems.forEach((carouselItem, index) => {
      const image = carouselItem.querySelector('[data-image]');
      if (image) {
        this.addDisposableEventListener(carouselItem, 'click', () => this.animateTo(index));
      }
    });

    this.paginationItems.forEach((paginationItem, index) => {
      this.addDisposableEventListener(paginationItem, 'click', () => this.animateTo(index));
    });
  }

  private handleResize(): void {
    this.visibleCount = 0;
    this.itemWidth = this.carouselItems[0] && this.carouselItems[0].clientWidth;
    const offset = this.itemWidth * this.currentItem;

    TweenMax.set(this.carousel, {
      x: this.isRtlDirection ? offset : -offset,
    });
    this.onDrag();
    this.updateArrowsVisibility();
  }

  private countCardVisibility(card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const isVisible =
      rect.right < (window.innerWidth || document.documentElement.clientWidth) && rect.left > 0;

    if (isVisible) {
      this.visibleCount++;
    }
  }

  private updateArrowsVisibility(): void {
    if (this.visibleCount === 0 || this.visibleCount === this.itemTotalCount) {
      this.carouselControls.classList.add(StateClassNames.HIDDEN);
    } else {
      this.carouselControls.classList.remove(StateClassNames.HIDDEN);
    }
  }

  private animateTo(newIndex: number): void {
    const offset = this.itemWidth * newIndex;
    TweenMax.to(this.carousel, 0.3, {
      x: this.isRtlDirection ? offset : -offset,
      onUpdate: () => {
        this.onDrag();
      },
      onStart: () => {
        this.currentItem = newIndex;
        this.previousButton.disabled = this.currentItem === 0;
        this.nextButton.disabled = this.currentItem === this.carouselItems.length - 1;
      },
    });
  }

  private initCarousel(): void {
    [this.dragger] = Draggable.create(this.carousel, {
      type: 'x',
      throwProps: true,
      dragClickables: false,
      zIndexBoost: false,
      snap: this.getSnap.bind(this),
      bounds: this.getBounds(),
      onDrag: this.onDrag.bind(this),
      onThrowUpdate: this.onDrag.bind(this),
    });
    this.onDrag();
    this.updateArrowsVisibility();
  }

  /**
   * @private
   * @method onDrag
   */
  private onDrag(): void {
    // tslint:disable-next-line
    // @ts-ignore
    const x = (<any>this.carousel._gsTransform).x;
    const draggerX = this.isRtlDirection ? this.dragger.maxX : this.dragger.minX;
    const progress = Math.abs(x / draggerX) || 0;
    const scaleMin = 0.69;
    const scaleMax = 1;
    const previousItem = this.currentItem;
    this.currentItem = Math.round(progress * (this.carouselItems.length - 1));
    this.previousButton.disabled = this.currentItem === 0;
    this.nextButton.disabled = this.currentItem === this.carouselItems.length - 1;
    this.visibleCount = 0;

    this.carouselItems.forEach((item, index) => {
      const itemCenter = index / (this.carouselItems.length - 1) || 0;
      const absoluteProgress = Math.max(
        -1,
        Math.min(1, (itemCenter - progress) * (this.carouselItems.length - 1)),
      ); // Number between -1 and 1
      const additionalOffset = this.isRtlDirection ? 15 : -15;
      const itemProgress = 1 - Math.abs(absoluteProgress); // Transform into number between 0 and 1
      TweenMax.set(item, {
        scale: scaleMin + (scaleMax - scaleMin) * Power2.easeInOut.getRatio(itemProgress),
        xPercent: additionalOffset * itemProgress,
      });

      TweenMax.set(item.children, {
        xPercent: this.isRtlDirection
          ? Math.max(0, (itemCenter - progress) * (43 * (this.carouselItems.length - 1)))
          : Math.min(0, (itemCenter - progress) * (-43 * (this.carouselItems.length - 1))),
      });

      const businessCard: null | HTMLElement = item.querySelector('.m-businessCard');
      if (businessCard) this.countCardVisibility(businessCard);
    });

    if (this.currentItem !== previousItem) {
      const previousContentWrapper = this.carouselItems[previousItem].querySelector(
        '[data-card-content]',
      );
      if (previousContentWrapper) {
        TweenMax.killTweensOf(previousContentWrapper.children);
        TweenMax.to(previousContentWrapper.children, 0.15, {
          autoAlpha: 0,
        });
      }
      const newContentWrapper = this.carouselItems[this.currentItem].querySelector(
        '[data-card-content]',
      );
      if (newContentWrapper) {
        TweenMax.killTweensOf(newContentWrapper.children);
        TweenMax.set(newContentWrapper.children, { clearProps: 'all' });
        TweenMax.staggerFrom(
          newContentWrapper.children,
          0.3,
          {
            y: 50,
            autoAlpha: 0,
            ease: eases.VinnieInOut,
          },
          0.1,
        );
      }
    }

    this.paginationItems.forEach((item, index) => {
      item.classList.toggle(StateClassNames.ACTIVE, this.currentItem === index);
    });
  }

  /**
   * @private
   * @method getBounds
   */
  private getBounds(): { minX: number; maxX: number } {
    const offset = this.itemWidth * (this.carouselItems.length - 1);
    const bounds = offset > 0 ? offset : 0;
    return {
      maxX: this.isRtlDirection ? bounds : 0,
      minX: this.isRtlDirection ? 0 : bounds * -1,
    };
  }

  /**
   * @private
   * @method getSnap
   */
  private getSnap(endValue: number): number {
    return Math.round(endValue / this.itemWidth) * this.itemWidth;
  }

  public dispose() {
    super.dispose();
  }
}
