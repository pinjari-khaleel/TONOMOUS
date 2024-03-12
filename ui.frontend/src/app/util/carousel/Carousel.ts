import EventDispatcher from 'seng-event';
import Draggable from 'gsap/Draggable';
import debounce from 'lodash/debounce';
import clamp from 'lodash/clamp';
import { TweenMax, Power2 } from 'gsap';

import CarouselEvent from './CarouselEvent';
import { ThrowPropsPlugin } from '../../vendor/gsap/ThrowPropsPlugin';
import { addEventListener } from 'seng-disposable-event-listener';
import { toggleInert } from '../toggleInert';

type CarouselOptions = {
  defaultIndex: number;
  infinite: boolean;
  slidesInViewport: number;
  autoPlayInterval: number;
  rtl?: boolean;
};

/**
 * A reusable carousel class that takes away most of the draggable configuration
 *
 * Example:
 *
 * ```html
 * <div class="js-carousel">
 *   <div class="js-carousel-slides">
 *     <div class="js-carousel-slide">👋 Hi i'm a slide!</div>
 *   </div>
 * </div>
 * ```
 *
 * ```typescript
 * const carousel = new Carousel(document.body.querySelector('.js-carousel'), {
 *   defaultIndex: 0,
 *   infinite: true,
 * });
 * ```
 */
export default class Carousel extends EventDispatcher {
  public static IS_ACTIVE_CLASS: string = 'is-carousel-active';

  public static CAROUSEL_SLIDES_CLASS: string = '[data-hotspots-slides]';
  public static CAROUSEL_SLIDE_CLASS: string = '[data-hotspots-slide]';

  public activeIndex: number = 0;

  public readonly slideElements: Array<HTMLElement>;
  private readonly element: HTMLElement;
  private readonly slidesElement: HTMLElement;
  private readonly removeResizeHandler: () => void;

  private draggableInstance: Draggable | null = null;

  private intervalId: number | undefined;

  private isDisabled = false;

  private readonly options: CarouselOptions = {
    defaultIndex: 0,
    infinite: true,
    slidesInViewport: 1,
    autoPlayInterval: 0,
    rtl: false,
  };

  constructor(element: HTMLElement, options: Partial<CarouselOptions> = {}) {
    super();

    this.element = element;
    this.options = { ...this.options, ...options };
    this.slidesElement = this.element.querySelector(
      `${Carousel.CAROUSEL_SLIDES_CLASS}`,
    ) as HTMLElement;
    this.slideElements = Array.from(
      this.element.querySelectorAll(`${Carousel.CAROUSEL_SLIDE_CLASS}`),
    );

    this.removeResizeHandler = addEventListener(
      window,
      'resize',
      debounce(this.handleResize.bind(this), 100),
    );

    if (this.slideElements.length > 0) {
      this.element.classList.add(Carousel.IS_ACTIVE_CLASS);
      this.createDraggableInstance();

      // Open up the default slide, this will also dispatch the first index change.
      this.open(this.options.defaultIndex);
    }

    this.updateInertSlides();
  }

  public disable(): void {
    this.isDisabled = true;

    if (this.draggableInstance) {
      this.draggableInstance.disable();
    }
  }

  public enable(): void {
    this.isDisabled = false;

    if (this.draggableInstance) {
      this.draggableInstance.enable();
    }
  }

  private createDraggableInstance(): void {
    if (ThrowPropsPlugin) {
      [this.draggableInstance] = Draggable.create(this.slidesElement, {
        type: 'x',
        throwProps: true,
        dragClickables: true,
        cursor: 'arrow',
        allowContextMenu: true,
        zIndexBoost: false,
        minDuration: 0.3,
        maxDuration: 0.3,
        edgeResistance: 0.99,
        snap: this.getSnap.bind(this),
        bounds: this.getBounds(),
        onDrag: this.updateActiveIndexWithDraggable.bind(this),
        onDragEnd: this.updateActiveIndexWithDraggable.bind(this),
        onThrowUpdate: this.updateActiveIndexWithDraggable.bind(this),
        onThrowComplete: this.handleThrowComplete.bind(this),
      });
    }
  }

  private get direction(): number {
    return this.options.rtl ? 1 : -1;
  }

  private getSnap(endValue: number): number {
    const gridWidth = this.getSlideWidth();

    return Math.round(endValue / gridWidth) * gridWidth;
  }

  public getSlideCount(): number {
    // We calculate the amount of slides based on the slide count provided through the options.
    return Math.ceil(this.slideElements.length / this.options.slidesInViewport);
  }

  /**
   * Get the items set to be in viewport
   */
  public getSlidesInViewport(): number {
    return this.options.slidesInViewport;
  }

  /**
   * Retrieve the slide width to calculate the correct steps that need to be taken.
   */
  private getSlideWidth(): number {
    const [firstSlide] = this.slideElements;
    if (firstSlide === undefined) {
      return 0;
    }

    // Return the width of the first slide or fallback to 0 if all fails.
    return (firstSlide.clientWidth || 0) * this.options.slidesInViewport;
  }

  /**
   * Calculate the bounds in which the carousel can be dragged.
   *
   * @returns {minX:number; maxX:number} The min and max values on which can be dragged.
   */
  private getBounds(): { minX: number; maxX: number } {
    if (!this.slideElements.length) {
      return {
        maxX: 0,
        minX: 0,
      };
    }

    const bounds =
      (this.getSlideCount() - 1) *
      this.slideElements[0].clientWidth *
      this.options.slidesInViewport;

    return {
      maxX: this.options.rtl ? bounds : 0,
      minX: this.options.rtl ? 0 : bounds * -1,
    };
  }

  /**
   * This method updates the internal activeIndex and dispatches a change event so any parent classes can listen to this.
   *
   * @param index - The new index that should become active.
   */
  private updateActiveIndex(index: number): void {
    this.updateInertSlides(index);

    // We do not want to dispatch events if the index has not changed.
    if (index !== this.activeIndex) {
      this.activeIndex = index;

      this.updateInertSlides();
      this.dispatchEvent(
        new CarouselEvent(CarouselEvent.CHANGE, {
          index,
        }),
      );
    }
  }

  // Add the inert attribute to all slides that are not in the viewport
  private updateInertSlides(activeIndex: number = this.activeIndex): void {
    this.slideElements.forEach((slideElement, slideIndex) => {
      const isInViewport =
        slideIndex >= activeIndex && slideIndex < activeIndex + this.getSlidesInViewport();

      toggleInert(slideElement, !isInViewport);
    });
  }

  private handleThrowComplete(): void {
    this.updateActiveIndexWithDraggable();
    this.startInterval();
  }

  private updateActiveIndexWithDraggable(): void {
    this.stopInterval();

    this.dispatchUpdateEvent();

    const slideCount = this.getSlideCount();

    // When the user drags the carousel we want to calculate the current index based on the `draggableInstance.x` value.
    const limit = this.draggableInstance![this.options.rtl ? 'maxX' : 'minX'];
    const progress = clamp(this.draggableInstance!.x / limit, 0, 1);

    this.updateActiveIndex(Math.round(progress * (slideCount - 1)));
  }

  private dispatchUpdateEvent(x: number = this.draggableInstance?.x || 0): void {
    this.dispatchEvent(new CarouselEvent(CarouselEvent.UPDATE, { x, index: this.activeIndex }));
  }

  private handleResize(): void {
    if (!this.isDisposed()) {
      if (this.draggableInstance) {
        this.draggableInstance.applyBounds(this.getBounds());
        this.draggableInstance.update();
      }

      this.open(this.activeIndex);
    }
  }

  public next(): Promise<number> {
    const newIndex = this.activeIndex + 1;
    const slideCount = this.getSlideCount() - 1;

    // This is where we stop if the end is reached and infinite is not enabled.
    if (!this.options.infinite && newIndex > slideCount) {
      return Promise.resolve(this.activeIndex);
    }

    return this.open(newIndex <= slideCount ? newIndex : 0);
  }

  public previous(): Promise<number> {
    const newIndex = this.activeIndex - 1;
    const slideCount = this.getSlideCount();

    // This is where we stop if the end is reached and infinite is not enabled.
    if (!this.options.infinite && newIndex < 0) {
      return Promise.resolve(this.activeIndex);
    }

    return this.open(newIndex >= 0 ? newIndex : slideCount - 1);
  }

  public open(index: number, duration: number = 0.5): Promise<number> {
    this.stopInterval();

    this.updateInertSlides(index);

    return new Promise((resolve: (index: number) => void) => {
      TweenMax.to(this.slidesElement, duration, {
        x: index * this.getSlideWidth() * this.direction,
        ease: Power2.easeOut,
        onUpdate: () => {
          this.dispatchUpdateEvent((this.slidesElement as any)._gsTransform.x);
        },
        onComplete: () => {
          this.updateActiveIndex(index);
          this.startInterval();
          resolve(index);
        },
      });
    });
  }

  public startInterval(): void {
    this.stopInterval();

    if (this.options.autoPlayInterval > 0) {
      this.intervalId = (setInterval(
        () => this.next(),
        this.options.autoPlayInterval,
      ) as unknown) as number;
    }
  }

  public stopInterval(): void {
    clearInterval(this.intervalId);
  }

  /**
   * This method will overwrite the initial amount of slides visible in the viewport, when triggered it will reset the
   * carousel to ensure we do not end up on an index that no longer exists.
   *
   * @param count - The amount of slides that you want in the viewport
   */
  public setSlidesInViewport(count: number): void {
    this.options.slidesInViewport = Math.max(1, count);
    this.activeIndex = 0;

    // Trigger a resize after changing count
    this.handleResize();
  }

  /**
   * This method will overwrite the initial auto play interval
   *
   * @param interval
   */
  public setAutoPlayInterval(interval: number): void {
    this.options.autoPlayInterval = interval;

    this.startInterval();
  }

  public dispose() {
    this.stopInterval();
    this.removeResizeHandler();

    this.element.classList.remove(Carousel.IS_ACTIVE_CLASS);

    if (this.draggableInstance) {
      this.draggableInstance.kill();
      this.slidesElement.removeAttribute('style');
      this.slideElements.forEach((slideElement) => {
        toggleInert(slideElement, false);
      });
    }

    super.dispose();
  }
}
