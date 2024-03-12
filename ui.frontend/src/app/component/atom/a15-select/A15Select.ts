import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import A15SelectTransitionController from './A15SelectTransitionController';

export default class A15Select extends AbstractTransitionComponent {
  public static readonly displayName: string = 'a15-select';

  public readonly transitionController: A15SelectTransitionController;

  private _select = this.getElement<HTMLSelectElement>('[data-select]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new A15SelectTransitionController(this);
  }

  public get select(): HTMLSelectElement | null {
    return this._select;
  }
}
