import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O48LoadingSpinnerTransitionController from './O48LoadingSpinnerTransitionController';

export default class O48LoadingSpinner extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o48-loading-spinner';

  public readonly transitionController: O48LoadingSpinnerTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O48LoadingSpinnerTransitionController(this);
  }
}
