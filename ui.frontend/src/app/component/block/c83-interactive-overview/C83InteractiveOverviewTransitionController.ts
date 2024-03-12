import AbstractTransitionController from '../../AbstractTransitionController';
import C83InteractiveOverview from './C83InteractiveOverview.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import A03Heading from '../../atom/a03-heading/A03Heading';
import { slideFadeIn } from '../../../animation/slideFadeIn';

class C83InteractiveOverviewTransitionController extends AbstractTransitionController<
  C83InteractiveOverview
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C83InteractiveOverview,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${A03Heading.displayName}"]`);

    title && timeline.add(slideFadeIn([title], 1, 0.2), 0.2);

    const cardButtons = parent.getElements('[data-card-button]');

    cardButtons.length > 0 &&
      timeline.staggerFromTo(
        cardButtons,
        0.8,
        {
          x: 100,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
          clearProps: 'all',
        },
        0.15,
        0.2,
      );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C83InteractiveOverview,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C83InteractiveOverview,
    id: string,
  ): void {}
}

export default C83InteractiveOverviewTransitionController;
