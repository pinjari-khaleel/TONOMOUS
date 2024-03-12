import AbstractTransitionController from '../../AbstractTransitionController';
import C93WebglScrollSpacer from './C93WebglScrollSpacer.lazy';
import { TimelineMax } from 'gsap';

class C93WebglScrollSpacerTransitionController extends AbstractTransitionController<
  C93WebglScrollSpacer
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C93WebglScrollSpacer,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C93WebglScrollSpacer,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C93WebglScrollSpacer,
    id: string,
  ): void {}
}

export default C93WebglScrollSpacerTransitionController;
