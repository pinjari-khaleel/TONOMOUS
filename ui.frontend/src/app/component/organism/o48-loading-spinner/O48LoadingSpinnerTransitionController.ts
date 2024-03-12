import AbstractTransitionController from '../../AbstractTransitionController';
import O48LoadingSpinner from './O48LoadingSpinner';
import { TimelineMax, Back } from 'gsap';

class O48LoadingSpinnerTransitionController extends AbstractTransitionController<
  O48LoadingSpinner
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O48LoadingSpinner,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    timeline.fromTo(
      parent.element,
      0.5,
      {
        autoAlpha: 0,
        pointerEvents: 'none',
      },
      {
        autoAlpha: 1,
        pointerEvents: 'all',
      },
    );

    const spinner = parent.getElement('[data-component="a17-spinner"]')!;
    timeline.fromTo(
      spinner,
      0.5,
      {
        scale: 0,
      },
      {
        scale: 1,
        ease: Back.easeOut,
      },
      '=-0.25',
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O48LoadingSpinner,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O48LoadingSpinner,
    id: string,
  ): void {}
}

export default O48LoadingSpinnerTransitionController;
