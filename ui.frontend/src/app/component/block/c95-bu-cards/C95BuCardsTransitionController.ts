import AbstractTransitionController from '../../AbstractTransitionController';
import C95BuCards from './C95BuCards';
import A03Heading from '../../atom/a03-heading/A03Heading';
import { TimelineMax } from 'gsap';
import { slideFadeIn } from '../../../animation/slideFadeIn';

class C95BuCardsTransitionController extends AbstractTransitionController<C95BuCards> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C95BuCards, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
    const title = parent.getElement(`[data-component="${A03Heading.displayName}"]`);

    title && timeline.add(slideFadeIn([title], 1, 0.2), 0.2);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C95BuCards,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C95BuCards,
    id: string,
  ): void {}
}

export default C95BuCardsTransitionController;
