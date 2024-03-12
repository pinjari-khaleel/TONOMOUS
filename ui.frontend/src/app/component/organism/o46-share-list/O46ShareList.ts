import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O46ShareListTransitionController from './O46ShareListTransitionController';

export default class O46ShareList extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o46-share-list';

  public readonly transitionController: O46ShareListTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O46ShareListTransitionController(this);
  }
}
