import AbstractTransitionController from '../../AbstractTransitionController';
import C90CardSlider from './C90CardSlider.lazy';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import eases from '../../../animation/eases';
import { slideFadeIn } from '../../../animation/slideFadeIn';
import M02Button from '../../molecule/m02-button/M02Button';

class C90CardSliderTransitionController extends AbstractTransitionController<C90CardSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C90CardSlider,
    id: string,
  ): void {
    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);

    if (title) {
      timeline.add(this.getTimeline(title));
    }

    const slideButtons = parent.getElements('[data-slide]');

    const buttonElements = parent.getElements(
      `[data-controls] [data-component="${M02Button.displayName}"]`,
    );

    slideButtons.length > 0 &&
      timeline.staggerFromTo(
        slideButtons,
        0.8,
        {
          x: 100,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        0.2,
        0.2,
      );

    buttonElements && timeline.add(slideFadeIn(buttonElements, 0.8, 0.15), 0.3);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C90CardSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C90CardSlider,
    id: string,
  ): void {}
}

export default C90CardSliderTransitionController;
