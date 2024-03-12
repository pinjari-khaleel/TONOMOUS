import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import A27TonomusLineTransitionController from './A27TonomusLineTransitionController';

export default class A27TonomusLine extends AbstractTransitionComponent {
  public static readonly displayName: string = 'a27-tonomus-line';

  public readonly transitionController: A27TonomusLineTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new A27TonomusLineTransitionController(this);
  }
}
