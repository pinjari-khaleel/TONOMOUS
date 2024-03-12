import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C102CarouselTransitionController from './C102CarouselTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import Draggable from 'gsap/Draggable';
import ThrowPropsPlugin from '../../../vendor/gsap/ThrowPropsPlugin';
import { TweenMax } from 'gsap';
import debounce from 'lodash/debounce';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import eases from '../../../animation/eases';
import { isRtl } from '../../../util/rtlUtils';

import './c102-carousel.scss';

export default class C102Carousel extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c102-carousel';
  public readonly transitionController: C102CarouselTransitionController;
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

    this.transitionController = new C102CarouselTransitionController(this);
    ThrowPropsPlugin;
  }

  public async adopted() {
    setTimeout(() => {
      setAsInitialised(this.element);
      this.itemWidth = this.carouselItems[0] && this.carouselItems[0].clientWidth;
      this.itemTotalCount = this.carouselItems.length;
      if (this.previousButton) {
        this.previousButton.disabled = true;
      }

      this.setFixedCardHeight();
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
    this.setFixedCardHeight();
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
    // console.log(`visiblecards: ${this.visibleCount}, cardtotalcount: ${this.itemTotalCount}`)
    if (this.visibleCount === 0 || this.visibleCount === this.itemTotalCount) {
      this.carouselControls.classList.add(StateClassNames.HIDDEN);
    } else {
      this.carouselControls.classList.remove(StateClassNames.HIDDEN);
    }
    this.setArrowLocation();
  }

  private animateTo(newIndex: number): void {
    const offset = (this.itemWidth * newIndex) + (24 * newIndex);
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
    const previousItem = this.currentItem;
    this.currentItem = Math.round(progress * (this.carouselItems.length - 1));
    this.previousButton.disabled = this.currentItem === 0;
    this.nextButton.disabled = this.currentItem === this.carouselItems.length - 1;
    this.visibleCount = 0;

    this.carouselItems.forEach((item, index) => {
      TweenMax.set(item, {
        x: 0,
      });
      
      TweenMax.set(item.children, {
        x: this.isRtlDirection
          ? Math.max(0, this.carouselItems.length - 1) + 24 * index
          : Math.min(0, this.carouselItems.length - 1) + 24 * index,
      });

      let teaserCard: null | HTMLElement = item.querySelector('.b-teaserCard');
      if (!teaserCard) teaserCard = item.querySelector('.m-opportunityCard');
      if (teaserCard) this.countCardVisibility(teaserCard);
    });
    this.paginationItems.forEach((item, index) => {
      item.classList.toggle(StateClassNames.ACTIVE, this.currentItem === index);
    });
  }

  /**
   * @private
   * @method getBounds
   */
  private getBounds(): { minX: number; maxX: number } {
    const index = this.carouselItems.length - 1;
    const offset = (this.itemWidth * index) + (24 * index);
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
    const index = Math.abs(Math.round(endValue / this.itemWidth))
    return this.itemWidth * Math.round(endValue / this.itemWidth) - (24 * index);
  }

  public dispose() {
    super.dispose();
  }

  private setArrowLocation() {
    var arrowControl = this.getElement('.b-carousel__controls') as HTMLElement;
    if (arrowControl) {
      var container = arrowControl.closest('.cmp-c102-carousel') as HTMLElement;
      if (container) {
        arrowControl.style.width = container?.getBoundingClientRect().width + 'px';
      }
    }
  }

  private setFixedCardHeight() {
    const teaserCards = this.getElements('.b-teaserCard');
    if (teaserCards) {
      let maxHeight = 0;
      teaserCards.forEach((teaserCard) => {
        const card = teaserCard.querySelector('.b-teaserCard__container') as HTMLElement;
        card.style.minHeight = "";
        if (card && card.offsetHeight > maxHeight) {
          maxHeight = card.offsetHeight;
        }
      });
      teaserCards.forEach((teaserCard) => {
        const fixedCardHeight = teaserCard.querySelector('.b-teaserCard__container') as HTMLElement;
        fixedCardHeight.style.minHeight = `${maxHeight}px`;
      });
    }
  }
}
