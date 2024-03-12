import AbstractTransitionController from '../../AbstractTransitionController';
import O73SubmitStep from './O73SubmitStep';
import { TimelineMax } from 'gsap';

class O73SubmitStepTransitionController extends AbstractTransitionController<O73SubmitStep> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O73SubmitStep,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O73SubmitStep,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O73SubmitStep,
    id: string,
  ): void {}
}

export default O73SubmitStepTransitionController;
