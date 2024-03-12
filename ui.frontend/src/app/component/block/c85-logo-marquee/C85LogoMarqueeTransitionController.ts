import AbstractTransitionController from '../../AbstractTransitionController';
import C85LogoMarquee from './C85LogoMarquee.lazy';
import { TimelineMax } from 'gsap';
import A01Image from '../../atom/a01-image/A01Image';
import eases from '../../../animation/eases';
import { slideFadeIn } from '../../../animation/slideFadeIn';

class C85LogoMarqueeTransitionController extends AbstractTransitionController<C85LogoMarquee> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C85LogoMarquee,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const heading = parent.getElement(`[data-paragraph-heading]`);

    heading && timeline.add(slideFadeIn([heading], 0.8, 0), 0.2);

    const imageElements = parent.getElements(`[data-component="${A01Image.displayName}"]`);

    imageElements.length > 0 &&
      timeline.staggerFromTo(
        imageElements,
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
        0.3,
      );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C85LogoMarquee,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C85LogoMarquee,
    id: string,
  ): void {}
}

export default C85LogoMarqueeTransitionController;
