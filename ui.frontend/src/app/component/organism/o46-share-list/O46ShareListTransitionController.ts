import AbstractTransitionController from '../../AbstractTransitionController';
import O46ShareList from './O46ShareList';
import { TimelineMax } from 'gsap';

class O46ShareListTransitionController extends AbstractTransitionController<O46ShareList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O46ShareList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O46ShareList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O46ShareList,
    id: string,
  ): void {}
}

export default O46ShareListTransitionController;
