import AbstractTransitionController from '../../AbstractTransitionController';
import O84EventCard from './O84EventCard';
import { TimelineMax } from 'gsap';

class O84EventCardTransitionController extends AbstractTransitionController<O84EventCard> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O84EventCard,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O84EventCard,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O84EventCard,
    id: string,
  ): void {}
}

export default O84EventCardTransitionController;
