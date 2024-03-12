import AbstractTransitionController from '../../AbstractTransitionController';
import O78TimelineCard from './O78TimelineCard';
import { TimelineMax } from 'gsap';

class O78TimelineCardTransitionController extends AbstractTransitionController<O78TimelineCard> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O78TimelineCard,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O78TimelineCard,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O78TimelineCard,
    id: string,
  ): void {}
}

export default O78TimelineCardTransitionController;
