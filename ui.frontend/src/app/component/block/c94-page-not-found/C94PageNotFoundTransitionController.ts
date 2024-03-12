import AbstractTransitionController from '../../AbstractTransitionController';
import C94PageNotFound from './C94PageNotFound.lazy';
import { TimelineMax } from 'gsap';
import { slideFadeIn } from '../../../animation/slideFadeIn';
import A01Image from '../../atom/a01-image/A01Image';

class C94PageNotFoundTransitionController extends AbstractTransitionController<C94PageNotFound> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C94PageNotFound,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const imageElement = parent.getElement(`[data-component="${A01Image.displayName}"]`);
    const content = parent.getElement(`[data-content]`);

    imageElement &&
      content?.children &&
      timeline.add(slideFadeIn(Array.from([imageElement, ...content.children]), 0.8, 0.15), 0.2);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C94PageNotFound,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C94PageNotFound,
    id: string,
  ): void {}
}

export default C94PageNotFoundTransitionController;
