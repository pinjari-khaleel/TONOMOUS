import { StateClassNames } from 'app/data/enum/StateClassNames';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C80DynamicQuoteTransitionController from './C80DynamicQuoteTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { handleMultipleItemStateClassNames } from 'app/util/stateClassNamesToggle';
import { openSharePopup } from 'app/util/OpenSharePopup';
import { TweenMax } from 'gsap';
import { toggleControlsVisibility } from '../../../util/swiper/toggleControlsVisibility';
import debounce from 'lodash/debounce';

import './c80-dynamic-quote.scss';

export default class C80DynamicQuote extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c80-dynamic-quote';

  public readonly transitionController: C80DynamicQuoteTransitionController;

  private quoteItemsContainer: ReadonlyArray<HTMLLIElement> = this.getElements(
    '[data-quote-items]',
  );
  private quoteItems: ReadonlyArray<HTMLLIElement> = this.getElements('[data-quote-item]');
  private nextQuoteButtons: ReadonlyArray<HTMLElement> = this.getElements('[data-next-quote]');
  private shareQuoteButtons: ReadonlyArray<HTMLElement> = this.getElements('[data-share-button]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C80DynamicQuoteTransitionController(this);

    this.addEventListeners();
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.setItemHeight();
  }

  private setItemHeight(): void {
    TweenMax.set(this.quoteItemsContainer, {
      clearProps: 'height',
    });
    let maxHeight = 0;
    this.quoteItems.forEach((quoteItem) => {
      if (quoteItem.offsetHeight > maxHeight) {
        maxHeight = quoteItem.offsetHeight;
      }
    });
    TweenMax.set(this.quoteItemsContainer, {
      height: maxHeight,
    });
  }

  private addEventListeners(): void {
    this.nextQuoteButtons.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => {
        const currentIndex = index !== this.quoteItems.length - 1 ? index + 1 : 0;
        handleMultipleItemStateClassNames(
          this.quoteItems,
          `${StateClassNames.ACTIVE}`,
          currentIndex,
        );
      });
    });

    this.shareQuoteButtons.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => {
        openSharePopup(item);
      });
    });

    this.addDisposableEventListener(window, 'resize', debounce(this.setItemHeight.bind(this), 300));
  }
}
