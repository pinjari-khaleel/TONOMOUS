import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent'
import C95BuCardsTransitionController from './C95BuCardsTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class C95BuCards extends AbstractTransitionComponent {
  public static readonly displayName:string = 'c95-bu-cards';

  public readonly transitionController:C95BuCardsTransitionController;

    constructor(el:HTMLElement) {
      super(el);

      this.transitionController = new C95BuCardsTransitionController(this);
    }
  
    public adopted() {
      setAsInitialised(this.element);
    }
}
