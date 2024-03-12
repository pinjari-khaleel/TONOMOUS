import AbstractComponent from 'app/component/AbstractComponent';
import { TweenMax } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import eases from '../../../animation/eases';

export default class M10ScrollButton extends AbstractComponent {
  public static readonly displayName: string = 'm10-scroll-button';

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    ScrollToPlugin;

    this.element &&
      this.addDisposableEventListener(this.element, 'click', this.onScrollButtonClick.bind(this));
  }

  public async adopted() {
    if (!window.location.href.includes('viewMode=story')) {
      this.app = await getAppComponent();
    }
  }

  private onScrollButtonClick(): void {
    let parentElement: Element | null;
    const parentCmpElement = this.element.closest('.cmp');
    const parentBlockElement = this.element.closest('[data-component^="c"]');

    if (parentCmpElement) {
      parentElement = parentCmpElement;
    } else {
      parentElement = parentBlockElement;
    }

    if (!parentElement) {
      throw new Error('The parent element cannot be found');
    }

    if (!this.app) {
      throw new Error('The app component cannot be found');
    }

    TweenMax.to(window, 0.5, {
      scrollTo: parentElement.nextElementSibling,
      ease: eases.VinnieInOut,
    });
  }

  public set elementHidden(isHidden: boolean) {
    TweenMax.to(this.element, 0.2, { autoAlpha: isHidden ? 0 : 1 });
  }
}
