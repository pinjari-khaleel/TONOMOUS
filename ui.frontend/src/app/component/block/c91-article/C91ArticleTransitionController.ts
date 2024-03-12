import AbstractTransitionController from '../../AbstractTransitionController';
import C91Article from './C91Article.lazy';
import { TimelineMax } from 'gsap';

class C91ArticleTransitionController extends AbstractTransitionController<C91Article> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C91Article, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C91Article,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C91Article,
    id: string,
  ): void {}
}

export default C91ArticleTransitionController;
