import AbstractComponent from 'app/component/AbstractComponent';
import debounce from 'lodash/debounce';

export default class C98BUSectionContainer extends AbstractComponent {
  public static readonly displayName: string = 'c98-bu-section-container';
  private static readonly IS_HIDDEN = 'transition-wrapper--hidden';
  private wrapper = this.element.parentElement?.querySelector(
    '.transition-wrapper',
  ) as HTMLElement | null;
  private thisElement: HTMLElement | null;
  public wrapperContent: string = '';
  private lastScrollTop: number = 0;

  constructor(el: HTMLElement) {
    super(el);
    this.thisElement = this.element?.id ? document.getElementById(this.element.id) : null;
  }

  public async adopted(): Promise<void> {
    await this.registerEventListener();
  }

  public dispose() {
    super.dispose();
  }

  private registerEventListener() {
    if (this.isDirectChildPage()) {
      this.onLoad();
    }
  }

  private onLoad(): void {
    this.addDisposableEventListener(window, 'load', this.handleLoad.bind(this));
  }

  private handleLoad(): void {
    this.createPixelDivs();
    this.createObserveIntersection(this.element?.parentElement);
  }

  private createPixelDivs(): void {
    const wrapper = this.element.parentElement?.querySelector('.transition-wrapper') as HTMLElement;
    if (wrapper && this.wrapperContent) {
      wrapper.innerHTML = this.wrapperContent;
    } else if (wrapper) {
      const height = Math.floor(window.innerHeight / 2 / 75) * 75;
      wrapper.style.height = height + 'px';
      const width = this.element?.offsetWidth || window.innerWidth;
      const wrapperArea = Math.ceil(width * height);
      const divArea = Math.ceil(50 * 50);
      const divRepeat = Math.ceil(wrapperArea / divArea) * 2;
      this.wrapperContent = "<div class='pixel-3'></div>".repeat(divRepeat);
      wrapper.innerHTML = this.wrapperContent;
      this.wrapper?.querySelectorAll('div:nth-child(11n + 1)').forEach((pixel) => {
        pixel.classList.remove('pixel-3');
        pixel.classList.add('pixel-1');
      });
      this.wrapper?.querySelectorAll('div.pixel-3:nth-child(6n + 1)').forEach((pixel) => {
        pixel.classList.remove('pixel-3');
        pixel.classList.add('pixel-2');
      });
    }
  }

  private createObserveIntersection(element: HTMLElement | null): void {
    // Define the options for the Intersection Observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1], // percentage of element's view
    };

    // Create a new Intersection Observer
    const observer = new IntersectionObserver(function (entries, observer) {
      // Loop over the entries
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, options);

    // Start observing the element
    if (element !== null && this.element.parentElement) {
      observer.observe(<Element>this.element.parentElement);
    }
  }

  private isDirectChildPage(): boolean {
    const parent =
      this.element?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement ||
      null;
    const isDirectChild =
      (parent &&
        parent.classList.contains('root') &&
        parent.classList.contains('responsivegrid')) ||
      false;
    return isDirectChild;
  }
}
