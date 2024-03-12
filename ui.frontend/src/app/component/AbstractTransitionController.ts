import { isEditor } from 'app/util/aemEditorUtils';
import { MubanTransitionController } from 'muban-transition-component';
import { TimelineMax } from 'gsap';
import { IMubanTransitionMixin } from 'muban-transition-component/lib/interface/IMubanTransitionMixin';
import eases from '../animation/eases';

abstract class AbstractTransitionController<
  T extends IMubanTransitionMixin = IMubanTransitionMixin
> extends MubanTransitionController {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: T, id: string): void {}

  protected abstract setupTransitionOutTimeline(timeline: TimelineMax, parent: T, id: string): void;

  protected abstract setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: T,
    id: string,
  ): void;

  protected addSlideInElements(
    elements: ReadonlyArray<HTMLElement | Element | null>,
    timeline: TimelineMax,
  ): void {
    const isAemEditor = isEditor();
    if (isAemEditor) return;

    timeline.staggerFromTo(
      elements.filter((element) => element !== null),
      0.8,
      {
        y: 50,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        clearProps: 'y,opacity,visibility',
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.2,
        },
      },
      0,
      '=-0.5',
    );
  }
}

export default AbstractTransitionController;
