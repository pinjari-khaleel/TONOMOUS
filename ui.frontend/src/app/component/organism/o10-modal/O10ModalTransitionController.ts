import AbstractTransitionController from '../../AbstractTransitionController';
import O10Modal from './O10Modal';
import { TimelineMax, Expo, Power2 } from 'gsap';

class O10ModalTransitionController extends AbstractTransitionController<O10Modal> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: O10Modal, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const panel = parent.getElement('[data-panel]');
    const mask = parent.getElement('[data-mask]');
    if (panel) {
      timeline.fromTo(
        panel,
        0.5,
        {
          xPercent: 100,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          ease: Expo.easeInOut,
          clearProps: 'opacity, visibility',
        },
        '0',
      );
    }
    if (mask) {
      timeline.fromTo(
        mask,
        0.3,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          ease: Power2.easeInOut,
          clearProps: 'opacity, visibility',
        },
        '0',
      );
    }
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: O10Modal, id: string): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O10Modal,
    id: string,
  ): void {}
}

export default O10ModalTransitionController;
