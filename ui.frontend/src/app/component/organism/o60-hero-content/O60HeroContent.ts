import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O60HeroContentTransitionController from './O60HeroContentTransitionController';

export default class O60HeroContent extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o60-hero-content';
  public readonly transitionController: O60HeroContentTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O60HeroContentTransitionController(this);
  }

  public dispose() {
    super.dispose();
  }
}
