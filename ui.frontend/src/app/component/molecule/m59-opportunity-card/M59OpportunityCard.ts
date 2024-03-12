import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent'
import M59OpportunityCardTransitionController from './M59OpportunityCardTransitionController';


export default class M59OpportunityCard extends AbstractTransitionComponent {
  public static readonly displayName:string = 'm59-opportunity-card';

  public readonly transitionController:M59OpportunityCardTransitionController;

    constructor(el:HTMLElement) {
      super(el);

      this.transitionController = new M59OpportunityCardTransitionController(this);
    }
  
}
