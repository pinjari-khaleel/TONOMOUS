import AbstractTransitionController from '../../AbstractTransitionController';
import M04ComponentHeader from './M04ComponentHeader';
import { TimelineMax } from 'gsap';
import {
  SplitAnimationStart,
  splitWordAnimationVertical,
} from '../../../animation/splitTextAnimation';
import { isEditor } from 'app/util/aemEditorUtils';

class M04ComponentHeaderTransitionController extends AbstractTransitionController<
  M04ComponentHeader
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: M04ComponentHeader,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const isAemEditor = isEditor();
    if (isAemEditor) return;

    const { alignment, disableTransition } = parent.element.dataset;
    if (disableTransition === 'true') return;

    if (parent.splitHeading) {
      timeline.add(
        splitWordAnimationVertical(parent.splitHeading, alignment as SplitAnimationStart),
      );
    }

    if (parent.splitEyebrow) {
      timeline.add(
        splitWordAnimationVertical(parent.splitEyebrow, alignment as SplitAnimationStart),
        parent.splitEyebrow ? 0.1 : 0,
      );
    }

    if (parent.splitMoustache) {
      timeline.add(
        splitWordAnimationVertical(parent.splitMoustache, alignment as SplitAnimationStart),
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M04ComponentHeader,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M04ComponentHeader,
    id: string,
  ): void {}
}

export default M04ComponentHeaderTransitionController;
