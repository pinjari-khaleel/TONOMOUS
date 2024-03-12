import AbstractComponent from 'app/component/AbstractComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class C100Tabs extends AbstractComponent {
  public static readonly displayName: string = 'c100-tabs';
  private readonly tabNavigationItems = this.getElements('.cmp-tabs__tab');
  private readonly carouselControls = this.getElement('[data-controls]') as HTMLElement;
  private visibleCount: number = 0;
  private itemTotalCount: number = 0;

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.setFixedCardHeight();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.tabNavigationItems.forEach((tabItem) => {
      this.addDisposableEventListener(tabItem, 'click', () => this.handleTabChange());
    });
  }

  private handleTabChange() {
    const activeTab = this.getElement('.cmp-tabs__tabpanel--active') as HTMLElement;
    if (activeTab) {
        const carousel = activeTab.querySelector('[data-carousel]');
        if (carousel) {
          const carouselItems = carousel?.querySelectorAll('[data-carousel-item]') || [];
          this.itemTotalCount = carouselItems.length;
          this.visibleCount = 0;
          carouselItems.forEach((item) => {
            let teaserCard: null | HTMLElement = item.querySelector('.b-teaserCard');
            if (!teaserCard) teaserCard = item.querySelector('.m-opportunityCard');
            if (teaserCard) this.countCardVisibility(teaserCard);
          });
          this.updateArrowsVisibility();
        }
        else {
            this.visibleCount = -1;
        }
    }
    this.setFixedCardHeight();
  }

  private isCardVisible(card: HTMLElement) {
    if (card) {
        const rect = card.getBoundingClientRect();
        return rect.right < (window.innerWidth || document.documentElement.clientWidth) && rect.left > 0;
    }
    return false;
  }

  private countCardVisibility(card: HTMLElement) {
    if (this.isCardVisible(card)) {
      this.visibleCount++;
    }
  }

  private updateArrowsVisibility() {
    // console.log(`visiblecards: ${this.visibleCount}, cardtotalcount: ${this.itemTotalCount}`)
    if (this.visibleCount === 0 || this.visibleCount === this.itemTotalCount) {
      this.carouselControls.classList.add(StateClassNames.HIDDEN);
    } else {
      this.carouselControls.classList.remove(StateClassNames.HIDDEN);
    }
    this.setArrowLocation();
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
