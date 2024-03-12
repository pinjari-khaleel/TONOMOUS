import AbstractTransitionController from '../../AbstractTransitionController';
import C80DynamicQuote from './C80DynamicQuote.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import A02Icon from '../../atom/a02-icon/A02Icon';
import A03Heading from '../../atom/a03-heading/A03Heading';
import M02Button from '../../molecule/m02-button/M02Button';
import { slideFadeIn } from '../../../animation/slideFadeIn';

class C80DynamicQuoteTransitionController extends AbstractTransitionController<C80DynamicQuote> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C80DynamicQuote,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const animationElements = [];

    const imageMask = parent.getElement('[data-image-mask]');

    const iconQuote = parent.getElement(`[data-component="${A02Icon.displayName}"]`);

    const heading = parent.getElement(`[data-component="${A03Heading.displayName}"]`);

    const buttons = parent.getElements(`[data-component="${M02Button.displayName}"]`);

    const content = parent.getElement(`[data-content]`);

    iconQuote && animationElements.push(iconQuote);
    heading && animationElements.push(heading);
    buttons && animationElements.push(buttons);
    content && animationElements.push(content);

    imageMask &&
      timeline.from(
        imageMask,
        0.6,
        {
          clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
          ease: eases.VinnieInOut,
          clearProps: 'clipPath',
        },
        0.2,
      );

    timeline.add(slideFadeIn(animationElements as ReadonlyArray<HTMLElement>, 1, 0.2), 0.2);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C80DynamicQuote,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C80DynamicQuote,
    id: string,
  ): void {}
}

export default C80DynamicQuoteTransitionController;
