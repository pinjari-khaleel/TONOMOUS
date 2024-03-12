import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import A17SpinnerTransitionController from './A17SpinnerTransitionController';

export default class A17Spinner extends AbstractTransitionComponent {
  public static readonly displayName: string = 'a17-spinner';

  public readonly transitionController: A17SpinnerTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new A17SpinnerTransitionController(this);
  }
}
