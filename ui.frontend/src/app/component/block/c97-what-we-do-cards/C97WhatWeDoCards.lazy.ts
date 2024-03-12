import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C97WhatWeDoTransitionController from './C97WhatWeDoCardsTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { StateClassNames } from 'app/data/enum/StateClassNames';

export default class C97WhatWeDo extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c97-what-we-do-cards';

  public readonly transitionController: C97WhatWeDoTransitionController;

  private readonly cards = this.getElement('[data-carousel-container]') as HTMLElement;
  private readonly carouselItems = this.getElements('[data-carousel-item]');
  private readonly carouselControls = this.getElement('[data-controls]') as HTMLElement;

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C97WhatWeDoTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.addEventListeners();
    this.carouselButton();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(this.cards, 'mousedown', (e: MouseEvent) => {
      this.isDragging = true;
      this.startX = e.pageX - this.cards.offsetLeft;
      this.scrollLeft = this.cards.scrollLeft;
      this.cards.classList.add('-isGrabbed');
    });

    this.addDisposableEventListener(document, 'mouseup', () => {
      this.isDragging = false;

      this.cards.classList.remove('-isGrabbed');
    });

    this.addDisposableEventListener(document, 'mousemove', (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();

      const x = e.pageX - this.cards.offsetLeft;
      const walk = (x - this.startX) * 2; // Adjust the multiplier for faster/slower scrolling

      this.cards.scrollLeft = this.scrollLeft - walk;
    });

    this.addDisposableEventListener(window, 'resize', () => {
      this.carouselButton();
    });
  }

  private carouselButton(): void {
    const isOverflowing = this.cards.scrollWidth > this.cards.clientWidth;
    if (isOverflowing && this.cards.clientWidth > 480) {
      this.carouselControls.classList.remove(StateClassNames.HIDDEN);
      this.cards.style.cursor = 'move';
    } else {
      this.carouselControls.classList.add(StateClassNames.HIDDEN);
      this.cards.style.cursor = 'default';
    }
  }
}
