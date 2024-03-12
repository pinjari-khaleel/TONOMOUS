import AbstractTransitionController from '../../AbstractTransitionController';
import C87CardCarousel from './C87CardCarousel.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import A03Heading from '../../atom/a03-heading/A03Heading';
import { slideFadeIn } from '../../../animation/slideFadeIn';
import M02Button from '../../molecule/m02-button/M02Button';

class C87CardCarouselTransitionController extends AbstractTransitionController<C87CardCarousel> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C87CardCarousel,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${A03Heading.displayName}"]`);

    title && timeline.add(slideFadeIn([title], 1, 0.2), 0.2);

    const slideButtons = parent.getElements('[data-slide-button]');

    const buttonElements = parent.getElements(
      `[data-controls] [data-component="${M02Button.displayName}"]`,
    );

    slideButtons.length > 0 &&
      timeline.staggerFromTo(
        slideButtons,
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

    buttonElements && timeline.add(slideFadeIn(buttonElements, 0.8, 0.15), 0.3);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C87CardCarousel,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C87CardCarousel,
    id: string,
  ): void {}
}

export default C87CardCarouselTransitionController;
