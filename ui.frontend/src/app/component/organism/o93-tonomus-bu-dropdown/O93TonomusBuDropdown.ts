import AbstractComponent from 'app/component/AbstractComponent';
import { getAppComponent } from '../../../util/getElementComponent';
import { TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import App from '../../layout/app/App';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class O93TonomusBuDropdown extends AbstractComponent {
  public static readonly displayName: string = 'o93-tonomus-bu-dropdown';
  private app: App | null = null;
  private readonly toggleElement: HTMLElement;
  private readonly businessUnitList = this.getElement('[data-bu-list]') as HTMLElement;
  private readonly businessUnitToggle = this.getElement('[data-bu-toggle]') as HTMLInputElement;

  constructor(el: HTMLElement) {
    super(el);
    this.toggleElement = <HTMLElement>this.getElement('[data-toggle]');
    this.addEventListeners();
  }

  private addEventListeners = (): void => {
    this.addDisposableEventListener(
      this.businessUnitToggle,
      'change',
      this.toggleDropdown.bind(this),
    );
    this.addDisposableEventListener(window, 'click', this.handleWindowClick.bind(this));
  };

  /**
   * @privatem
   * @method toggleDropdown
   */
  public toggleDropdown = (): void => {
    this.element.classList.toggle(StateClassNames.ACTIVE, this.businessUnitToggle.checked);
    if (this.businessUnitToggle.checked && this.businessUnitList) {
      const businessUnitListArray = Array.from(this.businessUnitList.children);
      TweenMax.staggerFrom(
        businessUnitListArray.filter((element) => element !== null),
        0.4,
        {
          y: 25,
          autoAlpha: 0,
          ease: eases.VinnieInOut,
        },
        0.08,
      );
    } else {
      TweenMax.set(this.businessUnitList.children, {
        clearProps: 'all',
      });
    }
  };

  public async adopted() {
    this.app = await getAppComponent();
  }

  private handleWindowClick(): void {
    if (!this.businessUnitToggle.checked) return;

    if (!this.element.contains(<HTMLElement>event?.target)) {
      this.businessUnitToggle.checked = false;
    }
  }
}
