import AbstractTransitionController from '../../AbstractTransitionController';
import O15StylizedOptions from './O15StylizedOptions';
import { TimelineMax } from 'gsap';

class O15StylizedOptionsTransitionController extends AbstractTransitionController<
  O15StylizedOptions
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O15StylizedOptions,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O15StylizedOptions,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O15StylizedOptions,
    id: string,
  ): void {}
}

export default O15StylizedOptionsTransitionController;
