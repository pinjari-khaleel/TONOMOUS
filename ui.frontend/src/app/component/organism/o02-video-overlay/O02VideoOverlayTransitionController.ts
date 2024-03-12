import AbstractTransitionController from '../../AbstractTransitionController';
import O02VideoOverlay from './O02VideoOverlay';
import { TimelineMax, Linear } from 'gsap';

class O02VideoOverlayTransitionController extends AbstractTransitionController<O02VideoOverlay> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O02VideoOverlay,
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
    parent: O02VideoOverlay,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O02VideoOverlay,
    id: string,
  ): void {}
}

export default O02VideoOverlayTransitionController;
