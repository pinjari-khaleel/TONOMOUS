import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import S12BuHeaderTransitionController from './S12BuHeaderTransitionController';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import domFocusLock from 'dom-focus-lock';
import App from '../../layout/app/App';
import awaitElementComponent, { getAppComponent } from '../../../util/getElementComponent';
import { isElementInMiddle } from 'app/util/enterViewportUtils';
import debounce from 'lodash/debounce';
import C93WebglScrollSpacer from '../c93-webgl-scroll-spacer/C93WebglScrollSpacer.lazy';

export default class S12BuHeader extends AbstractTransitionBlock {
  public static displayName: string = 's12-bu-header';
  public transitionController: S12BuHeaderTransitionController;
  private dropdownActive: boolean = false;
  private isScrolledLimit: number = 200;
  private scrollTimeout: number | null = null;
  private app: App | null = null;
  private readonly leftNavOriginalTop = this.getElement('.o-tonomusSidebar')?.offsetTop || 0;
  private readonly toggleCheckbox: HTMLInputElement = this.getElement(
    '[data-toggle-checkbox]',
  ) as HTMLInputElement;
  private readonly toggleElement: HTMLElement = this.getElement(
    '[data-dropdown-toggle]',
  ) as HTMLElement;
  private readonly linkList = this.getElement('[data-link-list]') as HTMLElement;
  private readonly links = this.getElements('[data-link]') as HTMLAnchorElement[];

  public forceScrollState = false;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new S12BuHeaderTransitionController(this);
    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private handleActiveLinkState(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      const activeLink = document.querySelector('.-isActive.-isUnderline [data-link]');
      var hasNewActiveLink: boolean = false;
      this.links.forEach((anchorElement) => {
        const targetScrollElement = document.querySelector(anchorElement.hash);
        if (targetScrollElement instanceof HTMLElement && isElementInMiddle(targetScrollElement)) {
          activeLink?.parentElement?.classList.remove(StateClassNames.ACTIVE, '-isUnderline');
          anchorElement.parentElement?.classList.add(StateClassNames.ACTIVE, '-isUnderline');
          hasNewActiveLink = true;
          return;
        }
      });

      // if none is selected, set the first link as activeLink
      if (!activeLink && !hasNewActiveLink && this.links.length > 0) {
        this.links[0].parentElement?.classList.add(StateClassNames.ACTIVE, '-isUnderline');
      }
    }, 100);
  }

  private handleResize(): void {
    const languageSelector = this.getElement('[data-component="o83-tonomus-language-selector"]');

    if (this.linkList && this.linkList.children && languageSelector && this.dropdownActive) {
      TweenMax.set(Array.from([...this.linkList.children, languageSelector]), {
        clearProps: 'all',
      });
    }
    this.toggleCheckbox.checked = false;
    this.scrollEnabled = true;
    this.dropdownActive = false;
  }

  private handleScroll(): void {
    if (window.scrollY >= this.isScrolledLimit || this.forceScrollState) {
      this.element.classList.add(StateClassNames.SCROLLED);
    } else {
      this.element.classList.remove(StateClassNames.SCROLLED);
    }
    this.handleActiveLinkState();
  }

  /**
   * @private
   * @method toggleDropdown
   */
  public toggleDropdown = (): Promise<void> => {
    if (!this.dropdownActive) {
      return this.open();
    }

    return this.close();
  };

  private set scrollEnabled(isEnabled: boolean) {
    if (!this.app) {
      throw new Error('The app component cannot be found');
    }

    this.app.toggleScroll(isEnabled);
  }

  private async open(): Promise<void> {
    const languageSelector = this.getElement('[data-component="o83-tonomus-language-selector"]');

    if (this.linkList && this.linkList.children && languageSelector) {
      TweenMax.staggerFrom(
        Array.from([...this.linkList.children, languageSelector]),
        0.4,
        {
          y: 25,
          autoAlpha: 0,
          ease: eases.VinnieInOut,
        },
        0.08,
      );
    }

    domFocusLock.on(this.element);
    this.element.parentElement?.classList.add(StateClassNames.ACTIVE);
    this.handleActiveLinkState();
    this.scrollEnabled = false;
    this.dropdownActive = true;
  }

  private async close(): Promise<void> {
    domFocusLock.off(this.element);

    const languageSelector = this.getElement('[data-component="o83-tonomus-language-selector"]');

    if (this.linkList && this.linkList.children && languageSelector) {
      TweenMax.set(Array.from([...this.linkList.children, languageSelector]), {
        clearProps: 'all',
      });
    }
    this.element.parentElement?.classList.remove(StateClassNames.ACTIVE);
    this.scrollEnabled = true;
    this.dropdownActive = false;
  }

  private handleLinkClick(): void {
    const mouseEvent = event as MouseEvent;
    const anchorElement = mouseEvent.target as HTMLAnchorElement;
    const hashTagPosition = anchorElement.href.indexOf('#');
    if (hashTagPosition !== -1) {
      const anchorId = anchorElement.href.slice(hashTagPosition, anchorElement.href.length);
      const targetScrollElement = document.querySelector(anchorId);
      if (targetScrollElement) {
        mouseEvent.preventDefault();
        TweenMax.to(window, 0.8, {
          onStart: () => {
            if (this.app) {
              this.app.isScrolling = true;
              this.links?.forEach((elem) => {
                elem.parentElement?.classList.remove(StateClassNames.ACTIVE);
              });
              anchorElement.parentElement?.classList.add(StateClassNames.ACTIVE);
            }
          },
          onComplete: () => {
            if (this.app) {
              this.handleActiveLinkState();
              this.app.isScrolling = false;
              this.app
                .getElements(`[data-component=${C93WebglScrollSpacer.displayName}]`)
                ?.forEach((webglScrollSpacer) => {
                  awaitElementComponent<C93WebglScrollSpacer>(webglScrollSpacer).then(
                    (webglScrollSpacerComponent) => {
                      webglScrollSpacerComponent.checkBeyondView();
                    },
                  );
                });
            }
          },
          scrollTo: {
            y: anchorId,
            offsetY: -20,
            autoKill: false,
          },
          ease: eases.VinnieInOut,
        });
      }
    }
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(window, 'scroll', this.handleScroll.bind(this));
    this.addDisposableEventListener(window, 'scroll', this.addScrollListenerOnLastLink.bind(this));
    this.addDisposableEventListener(this.toggleElement, 'click', this.toggleDropdown.bind(this));
    this.addDisposableEventListener(window, 'resize', debounce(this.handleResize.bind(this), 300));
    this.links.forEach((link) => {
      this.addDisposableEventListener(link, 'click', this.handleLinkClick.bind(this));
      this.addDisposableEventListener(link, 'mouseover', () => {
        this.links.forEach((elem) => {
          elem.parentElement?.classList.remove('-isUnderline');
        });
      });
      this.addDisposableEventListener(link, 'mouseout', () => {
        this.links.forEach((elem) => {
          elem.parentElement?.classList.remove('-isUnderline');
          if (elem.parentElement?.classList.contains(StateClassNames.ACTIVE)) {
            elem.parentElement?.classList.add('-isUnderline');
          }
        });
      });
    });
    this.handleActiveLinkState();
  }

  private addScrollListenerOnLastLink(): void {
    const arrayLength = this.links?.length || 0;
    if (arrayLength > 0) {
      const lastIndex = arrayLength - 1;
      const anchorId = this.links[lastIndex].hash.replace('#', '');
      const thisElement: HTMLElement = document.getElementById(anchorId) as HTMLElement;
      const elemMiddle = -Math.abs(thisElement.offsetHeight / 3);
      const elemTop = thisElement.getBoundingClientRect().top;
      const overrideLeftNav = elemMiddle > elemTop;
      const leftNavElement = document.querySelector('.o-tonomusSidebar') as HTMLElement;
      if (overrideLeftNav) {
        const newElemTop = elemTop - elemMiddle + this.leftNavOriginalTop;
        leftNavElement.style.top = newElemTop + 'px';
      } else {
        leftNavElement.style.removeProperty('top');
      }
    }
  }
}
