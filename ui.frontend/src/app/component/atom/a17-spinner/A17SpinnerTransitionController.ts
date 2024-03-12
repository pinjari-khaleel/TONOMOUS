import AbstractTransitionController from '../../AbstractTransitionController';
import A17Spinner from './A17Spinner';
import { TimelineMax } from 'gsap';

class A17SpinnerTransitionController extends AbstractTransitionController<A17Spinner> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: A17Spinner, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: A17Spinner,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: A17Spinner,
    id: string,
  ): void {}
}

export default A17SpinnerTransitionController;
