import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import S10TonomusFooterTransitionController from './S10TonomusFooterTransitionController';

export default class S10TonomusFooter extends AbstractTransitionBlock {
  public static displayName: string = 's10-tonomus-footer';
  public transitionController: S10TonomusFooterTransitionController;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new S10TonomusFooterTransitionController(this);
  }
}
