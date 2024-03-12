import AbstractTransitionController from '../../AbstractTransitionController';
import C81ContentRoadmap from './C81ContentRoadmap';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import { slideFadeIn } from '../../../animation/slideFadeIn';
import A03Heading from '../../atom/a03-heading/A03Heading';

class C81ContentRoadmapTransitionController extends AbstractTransitionController<
  C81ContentRoadmap
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C81ContentRoadmap,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const mainHeading = parent.getElements(
      `[data-container] > [data-component="${A03Heading.displayName}"]`,
    );

    const imageMasks = parent.getElements('[data-image-mask]');

    const stepContentBlocks = parent.getElements('[data-step-content]');

    mainHeading && timeline.add(slideFadeIn(mainHeading, 1, 0), 0.2);

    imageMasks.length > 0 &&
      timeline.staggerFrom(
        imageMasks,
        0.6,
        {
          scale: 0,
          ease: eases.VinnieInOut,
          clearProps: 'clipPath',
        },
        0.4,
        0.2,
      );

    stepContentBlocks.forEach((stepContentBlock, index) => {
      if (stepContentBlock.children) {
        const animationElements = Array.from(stepContentBlock.children);
        timeline.add(slideFadeIn(animationElements as ReadonlyArray<Element>, 1, 0.2), index * 0.4);
      }
    });
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C81ContentRoadmap,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C81ContentRoadmap,
    id: string,
  ): void {}
}

export default C81ContentRoadmapTransitionController;
