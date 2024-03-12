import AbstractTransitionController from '../../AbstractTransitionController';
import C37LegalContent from './C37LegalContent.lazy';
import { TimelineMax } from 'gsap';

class C37LegalContentTransitionController extends AbstractTransitionController<C37LegalContent> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C37LegalContent,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C37LegalContent,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C37LegalContent,
    id: string,
  ): void {}
}

export default C37LegalContentTransitionController;
