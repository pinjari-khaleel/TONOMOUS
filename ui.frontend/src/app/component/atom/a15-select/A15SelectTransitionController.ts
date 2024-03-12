import AbstractTransitionController from '../../AbstractTransitionController';
import A15Select from './A15Select';
import { TimelineMax } from 'gsap';

class A15SelectTransitionController extends AbstractTransitionController<A15Select> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: A15Select, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: A15Select,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: A15Select,
    id: string,
  ): void {}
}

export default A15SelectTransitionController;
