import AbstractTransitionController from '../../AbstractTransitionController';
import C96VideoModal from './C96VideoModal';
import { TimelineMax } from 'gsap';

class C96VideoModalTransitionController extends AbstractTransitionController<C96VideoModal> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C96VideoModal,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C96VideoModal,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C96VideoModal,
    id: string,
  ): void {}
}

export default C96VideoModalTransitionController;
