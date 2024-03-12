import AbstractTransitionController from '../../AbstractTransitionController';
import C88KeyCtaList from './C88KeyCtaList.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import A03Heading from '../../atom/a03-heading/A03Heading';
import { slideFadeIn } from '../../../animation/slideFadeIn';

class C88KeyCtaListTransitionController extends AbstractTransitionController<C88KeyCtaList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C88KeyCtaList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${A03Heading.displayName}"]`);
    const listText = parent.getElement(`[data-list-text]`);

    title && listText && timeline.add(slideFadeIn([title, listText], 1, 0.2), 0.2);

    const ctaItems = parent.getElements('[data-cta-item]');

    ctaItems.length > 0 &&
      timeline.staggerFromTo(
        ctaItems,
        0.8,
        {
          x: 100,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        0.2,
        0.2,
      );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C88KeyCtaList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C88KeyCtaList,
    id: string,
  ): void {}
}

export default C88KeyCtaListTransitionController;
