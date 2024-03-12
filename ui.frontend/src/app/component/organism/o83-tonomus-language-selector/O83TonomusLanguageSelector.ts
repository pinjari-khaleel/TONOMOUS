import AbstractComponent from '../../AbstractComponent';
import { getAppComponent } from '../../../util/getElementComponent';
import { TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import App from '../../layout/app/App';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class O83TonomusLanguageSelector extends AbstractComponent {
  public static readonly displayName: string = 'o83-tonomus-language-selector';
  private app: App | null = null;
  private readonly toggleElement: HTMLElement;
  private readonly languageList = this.getElement('[data-language-list]') as HTMLElement;
  private readonly languageToggle = this.getElement('[data-language-toggle]') as HTMLInputElement;

  constructor(el: HTMLElement) {
    super(el);
    this.toggleElement = <HTMLElement>this.getElement('[data-toggle]');
    this.addEventListeners();
  }

  private addEventListeners = (): void => {
    this.addDisposableEventListener(this.languageToggle, 'change', this.toggleDropdown.bind(this));
    this.addDisposableEventListener(window, 'click', this.handleWindowClick.bind(this));
  };

  /**
   * @privatem
   * @method toggleDropdown
   */
  public toggleDropdown = (): void => {
    this.element.classList.toggle(StateClassNames.ACTIVE, this.languageToggle.checked);
    if (this.languageToggle.checked && this.languageList) {
      const languageListArray = Array.from(this.languageList.children);
      TweenMax.staggerFrom(
        languageListArray.filter((element) => element !== null),
        0.4,
        {
          y: 25,
          autoAlpha: 0,
          ease: eases.VinnieInOut,
        },
        0.08,
      );
    } else {
      TweenMax.set(this.languageList.children, {
        clearProps: 'all',
      });
    }
  };

  public async adopted() {
    this.app = await getAppComponent();
  }

  private handleWindowClick(): void {
    if (!this.languageToggle.checked) return;

    if (!this.element.contains(<HTMLElement>event?.target)) {
      this.languageToggle.checked = false;
    }
  }
}
