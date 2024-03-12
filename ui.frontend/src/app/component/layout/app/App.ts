import ScrollToPlugin from 'gsap/ScrollToPlugin';
import debounce from 'lodash/debounce';
import { CoreComponent } from 'muban-core';
import { ComponentModule } from 'muban-core/lib/utils/componentStore';
import getComponentForElement from 'muban-core/lib/utils/getComponentForElement';
import { PageTransitionController } from 'muban-page-transition-controller';
import { IMubanTransitionMixin, MubanTransitionVariable } from 'muban-transition-component';
import { ScrollTrackerComponentManager } from 'scroll-tracker-component-manager';
import { addEventListener } from 'seng-disposable-event-listener';
import { DisposableManager } from 'seng-disposable-manager';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import setViewportCustomProperties from '../../../util/setViewportCustomProperties';
import S09Overlay from '../../block/s09-overlay/S09Overlay';
import M10ScrollButton from '../../molecule/m10-scroll-button/M10ScrollButton';
import M33Cursor from '../../molecule/m33-cursor/M33Cursor';
import O48LoadingSpinner from '../../organism/o48-loading-spinner/O48LoadingSpinner';

export default class App extends CoreComponent {
  static displayName: string = 'app-root';

  public pageTransitionController: PageTransitionController | null = null;

  public scrollTrackerComponentManager: ScrollTrackerComponentManager<IMubanTransitionMixin>;

  public overlay: S09Overlay | null = null;

  private disposables: DisposableManager = new DisposableManager();
  private scrollButton: M10ScrollButton | null = null;
  private cursor: M33Cursor | null = null;
  private loadingSpinner: O48LoadingSpinner | null = null;
  private scrollTrackingEnabled = new Map<HTMLElement, true>();
  private scrollPosition = {
    X: 0,
    Y: 0,
  };
  private scrollLockTimeout: number | null = null;

  public isScrolling = false;

  constructor(element: HTMLElement) {
    super(element);

    // Promote data-tonomus attribute to HTML element

    if (process.env.NODE_ENV === 'development') {
      (document.firstElementChild as HTMLHtmlElement).dataset.tonomus = '';

      (document.firstElementChild as HTMLHtmlElement).dataset.theme = this.theme ?? 'tonomus';
    }

    this.scrollTrackerComponentManager = new ScrollTrackerComponentManager<IMubanTransitionMixin>({
      setDebugLabel: process.env.NODE_ENV === false,
      debugBorderColor: 'red',
      container: window,
      inViewProgressEnabled: true,
      resizeDebounce: 100,
    });

    this.toggleScroll(true);

    ScrollToPlugin;
  }

  getComponentInAppContext<T extends typeof CoreComponent>(component: T): InstanceType<T> | null {
    const element = this.getElement(
      `[data-component="${((component as unknown) as ComponentModule).displayName}"]`,
    );

    if (element) {
      return getComponentForElement<InstanceType<T>>(element);
    }

    return null;
  }

  /**
   * @public
   * @method allComponentsConstructed
   */
  public async adopted(): Promise<void> {
    this.element.classList.add(StateClassNames.READY);

    setViewportCustomProperties();

    this.disposables.add(
      addEventListener(
        window,
        'resize',
        debounce(() => setViewportCustomProperties(), 50),
      ),
    );

    this.scrollButton = this.getComponentInAppContext(M10ScrollButton);
    this.cursor = this.getComponentInAppContext(M33Cursor);
    this.loadingSpinner = this.getComponentInAppContext(O48LoadingSpinner);
    this.overlay = this.getComponentInAppContext(S09Overlay);

    this.addComponentsToScrollTracker();

    setTimeout(() => this.scrollTrackerComponentManager.handleResize(), 2000);

    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: false }); // <-- mark the event listerner as NOT passive
    window.addEventListener('mousewheel', this.handleScroll.bind(this), { passive: false }); // <-- mark the event listerner as NOT passive
  }

  private handleScroll(event: Event) {
    if (this.isScrolling) {
      event.preventDefault();
    }
  }

  public addComponentsToScrollTracker(): void {
    this.getElements(`[${MubanTransitionVariable.scrollComponentAttribute}]`).forEach(
      (element: HTMLElement) => {
        const componentId = element.getAttribute('data-component');

        if (!componentId) {
          // tslint:disable-next-line:no-console
          console.warn('Id for element missing', element);
          // return so that one missing component does not break the scroll tracking
          // for entire page
          return;
        }
        // only add component to scroll tracker if it hasn't
        // been already added
        if (!this.scrollTrackingEnabled.has(element)) {
          const component = getComponentForElement(element);

          if (!component) {
            // tslint:disable-next-line:no-console
            // Uncommenting the console.warn will warn about missing components. These components
            // are the components that are lazy loaded, and are added to scroll tracker
            // after their registration and instantiation.
            // console.warn('Component for element missing', element);
            // return so that one missing component does not break the scroll tracking
            // for entire page
            return;
          }

          this.scrollTrackerComponentManager.addComponentToScrollTracker(
            <IMubanTransitionMixin>component,
          );

          this.scrollTrackingEnabled.set(element, true);
        }
      },
    );
  }

  public isLinkInternal(link: string): boolean {
    const url = new URL(link);
    if (url.pathname === location.pathname) return false;
    return url.hostname === location.hostname;
  }

  public get linkElements(): ReadonlyArray<HTMLAnchorElement> {
    return [...document.querySelectorAll('a')].filter((link) => {
      if (!link.href) return;
      if (this.isLinkInternal(link.href)) return link;
    });
  }

  public set elementHidden(isHidden: boolean) {
    if (this.scrollButton) {
      this.scrollButton.elementHidden = isHidden;
    }
  }

  public toggleScroll(isEnabled: boolean) {
    document
      .querySelectorAll('html, body')
      .forEach((element) =>
        element.classList[isEnabled ? 'remove' : 'add'](StateClassNames.SCROLL_DISABLED),
      );

    this.toggleScrollIos(isEnabled);
  }

  private storeScrollPosition() {
    this.scrollPosition.Y = window.scrollY;
    this.scrollPosition.X = window.scrollX;
  }

  private scrollLock = () => {
    const { X, Y } = this.scrollPosition;
    // timeout is required, otherwise ios will ignore scrollTo
    this.scrollLockTimeout = setTimeout(() => window.scrollTo(X, Y), 200);
  };

  private toggleScrollIos(isEnabled: boolean) {
    if (isEnabled) {
      window.removeEventListener('touchmove', this.scrollLock, {
        passive: false,
      });
    } else {
      this.storeScrollPosition();
      window.addEventListener('touchmove', this.scrollLock, {
        passive: false,
      });
    }
  }

  public transformCursor(transform: boolean, icon?: string, variant?: string): void {
    if (this.cursor) {
      transform ? this.cursor.transformCursor(icon, variant) : this.cursor.resetCursor();
    }
  }

  public async setLoadingState(isLoading: boolean) {
    if (!this.loadingSpinner) return;
    if (isLoading) {
      this.toggleScroll(false);
      await this.loadingSpinner.transitionIn();
    } else {
      this.toggleScroll(true);
      await this.loadingSpinner.transitionOut();
    }
  }

  public updateScrollTrackerPoints(): void {
    this.scrollTrackerComponentManager.handleResize();
  }

  public get theme(): string | null {
    return this.element.dataset.theme ?? null;
  }

  public dispose() {
    // clean up stuff when hot reloading
    if (this.scrollTrackerComponentManager) {
      this.scrollTrackerComponentManager.dispose();
    }

    if (this.scrollLockTimeout) {
      clearTimeout(this.scrollLockTimeout);
    }

    this.disposables.dispose();
  }
}
