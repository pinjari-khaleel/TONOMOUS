import AbstractTransitionController from '../../AbstractTransitionController';
import O09ModalCarouselContent from './O09ModalCarouselContent';
import { TimelineMax } from 'gsap';

class O09ModalCarouselContentTransitionController extends AbstractTransitionController<
  O09ModalCarouselContent
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O09ModalCarouselContent,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O09ModalCarouselContent,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O09ModalCarouselContent,
    id: string,
  ): void {}
}

export default O09ModalCarouselContentTransitionController;
