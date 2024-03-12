import AbstractTransitionController from '../../AbstractTransitionController';
import A27TonomusLine from './A27TonomusLine';
import { TimelineMax } from 'gsap';

class A27TonomusLineTransitionController extends AbstractTransitionController<A27TonomusLine> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: A27TonomusLine,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: A27TonomusLine,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: A27TonomusLine,
    id: string,
  ): void {}
}

export default A27TonomusLineTransitionController;
