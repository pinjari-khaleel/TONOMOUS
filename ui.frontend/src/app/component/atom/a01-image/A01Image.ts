import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import A01ImageTransitionController from './A01ImageTransitionController';

export default class A01Image extends AbstractTransitionComponent {
  public static readonly displayName: string = 'a01-image';

  public readonly transitionController: A01ImageTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new A01ImageTransitionController(this);
  }
}
