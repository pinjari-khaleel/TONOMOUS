import AbstractTransitionController from '../../AbstractTransitionController';
import O38Lightbox from './O38Lightbox';
import { TimelineMax, Linear, Power2 } from 'gsap';

class O38LightboxTransitionController extends AbstractTransitionController<O38Lightbox> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O38Lightbox,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    timeline.fromTo(
      parent.element,
      0.6,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        ease: Linear.easeNone,
        clearProps: 'opacity, visibility',
      },
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O38Lightbox,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O38Lightbox,
    id: string,
  ): void {}
}

export default O38LightboxTransitionController;
