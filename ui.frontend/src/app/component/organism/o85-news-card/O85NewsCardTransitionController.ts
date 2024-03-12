import AbstractTransitionController from '../../AbstractTransitionController';
import O85NewsCard from './O85NewsCard';
import { TimelineMax } from 'gsap';

class O85NewsCardTransitionController extends AbstractTransitionController<O85NewsCard> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O85NewsCard,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O85NewsCard,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O85NewsCard,
    id: string,
  ): void {}
}

export default O85NewsCardTransitionController;
