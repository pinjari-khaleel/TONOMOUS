import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import S11TonomusNavigationTransitionController from './S11TonomusNavigationTransitionController';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import domFocusLock from 'dom-focus-lock';
import App from '../../layout/app/App';
import awaitElementComponent, { getAppComponent } from '../../../util/getElementComponent';
import { isElementVisibleInViewport } from 'app/util/enterViewportUtils';
import debounce from 'lodash/debounce';
import C93WebglScrollSpacer from '../c93-webgl-scroll-spacer/C93WebglScrollSpacer.lazy';

export default class S11TonomusNavigation extends AbstractTransitionBlock {
  public static displayName: string = 's11-tonomus-navigation';
  public transitionController: S11TonomusNavigationTransitionController;
  private dropdownActive: boolean = false;
  private isScrolledLimit: number = 200;
  private scrollTimeout: number | null = null;
  private activeLink: HTMLElement | null = null;
  private app: App | null = null;

  private readonly toggleCheckbox: HTMLInputElement = this.getElement(
    '[data-toggle-checkbox]',
  ) as HTMLInputElement;
  private readonly toggleElement: HTMLElement = this.getElement(
    '[data-dropdown-toggle]',
  ) as HTMLElement;
  private readonly linkList = this.getElement('[data-link-list]') as HTMLElement;
  private readonly links = this.getElements('[data-link]') as HTMLAnchorElement[];
  private readonly headerButton: HTMLElement = this.getElement(
    '[data-dropdown-toggle]',
  ) as HTMLElement;
  languageSelector = this.getElement('[data-component="o83-tonomus-language-selector"]');

  public forceScrollState = false;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new S11TonomusNavigationTransitionController(this);

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
      this.links.forEach((anchorElement) => {
        if (!anchorElement.hash.startsWith('#')) {
          anchorElement.classList.remove(StateClassNames.ACTIVE, '-isUnderline');
          return;
        }

        const targetScrollElement = document.querySelector(anchorElement.hash);
        if (targetScrollElement instanceof HTMLElement) {
          if (!isElementVisibleInViewport(targetScrollElement)) {
            anchorElement.classList.remove(StateClassNames.ACTIVE, '-isUnderline');
            return;
          }
          this.activeLink = anchorElement;
        }
      });
      if (this.activeLink) {
        this.activeLink.classList.add(StateClassNames.ACTIVE, '-isUnderline');
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
    this.activeLink = null;
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
    this.element.classList.add(StateClassNames.ACTIVE);
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
    this.element.classList.remove(StateClassNames.ACTIVE);
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
              this.links.forEach((elem) => {
                elem.classList.remove(StateClassNames.ACTIVE);
              });
              anchorElement.classList.add(StateClassNames.ACTIVE);
            }
          },
          onComplete: () => {
            if (this.app) {
              this.handleActiveLinkState();
              this.app.isScrolling = false;
              this.app
                .getElements(`[data-component=${C93WebglScrollSpacer.displayName}]`)
                .forEach((webglScrollSpacer) => {
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
    this.addDisposableEventListener(this.toggleElement, 'click', this.toggleDropdown.bind(this));
    this.addDisposableEventListener(window, 'resize', debounce(this.handleResize.bind(this), 300));

    this.links.forEach((link) => {
      this.addDisposableEventListener(link, 'click', this.handleLinkClick.bind(this));
      this.addDisposableEventListener(link, 'mouseover', () => {
        this.links.forEach((elem) => {
          elem.classList.remove('-isUnderline');
        });
      });
      this.addDisposableEventListener(link, 'mouseout', () => {
        this.links.forEach((elem) => {
          if (elem.classList.contains(StateClassNames.ACTIVE)) {
            elem.classList.add('-isUnderline');
          }
        });
      });
    });
  }
}
