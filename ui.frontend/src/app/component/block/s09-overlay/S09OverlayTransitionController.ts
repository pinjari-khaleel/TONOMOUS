import AbstractTransitionController from '../../AbstractTransitionController';
import S09Overlay from './S09Overlay';
import { TimelineMax, Power2, Linear } from 'gsap';

class C78OverlayTransitionController extends AbstractTransitionController<S09Overlay> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: S09Overlay, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: S09Overlay,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: S09Overlay,
    id: string,
  ): void {}
}

export default C78OverlayTransitionController;
