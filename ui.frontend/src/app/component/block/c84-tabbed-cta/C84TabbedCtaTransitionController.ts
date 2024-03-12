import AbstractTransitionController from '../../AbstractTransitionController';
import C84TabbedCta from './C84TabbedCta';
import { TimelineMax } from 'gsap';
import ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import eases from '../../../animation/eases';

class C84TabbedCtaTransitionController extends AbstractTransitionController<C84TabbedCta> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C84TabbedCta,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${ComponentHeader.displayName}"]`);

    const tabs = parent.getElements(`[data-tab]`);

    const firstContentItem = parent.getElement(`[data-content-item]`);
    const firstImageMask = parent.getElement(`[data-image-mask]`);

    if (title) {
      timeline.add(this.getTimeline(title));
    }

    tabs.length > 0 &&
      timeline.staggerFromTo(
        tabs,
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
        0.15,
        0.2,
      );

    firstContentItem &&
      timeline.from(
        firstContentItem,
        0.8,
        {
          clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
          ease: eases.VinnieInOut,
          clearProps: 'clipPath',
        },
        0.2,
      );

    firstImageMask &&
      timeline.from(
        firstImageMask,
        0.6,
        {
          clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
          ease: eases.VinnieInOut,
          clearProps: 'clipPath',
        },
        0.3,
      );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C84TabbedCta,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C84TabbedCta,
    id: string,
  ): void {}
}

export default C84TabbedCtaTransitionController;
