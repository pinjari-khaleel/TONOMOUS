import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C81ContentRoadmapTransitionController from './C81ContentRoadmapTransitionController';

export default class C81ContentRoadmap extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c81-content-roadmap';
  public readonly transitionController: C81ContentRoadmapTransitionController;

  private readonly mask1 = this.getElement('#contentRoadmapMask1');
  private readonly mask2 = this.getElement('#contentRoadmapMask2');
  private readonly mask3 = this.getElement('#contentRoadmapMask3');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C81ContentRoadmapTransitionController(this);
  }
}
