import AbstractTransitionController from '../../AbstractTransitionController';
import O24PopupMessage from './O24PopupMessage';
import { TimelineMax, Linear } from 'gsap';

class O24PopupMessageTransitionController extends AbstractTransitionController<O24PopupMessage> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O24PopupMessage,
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
    parent: O24PopupMessage,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O24PopupMessage,
    id: string,
  ): void {}
}

export default O24PopupMessageTransitionController;
