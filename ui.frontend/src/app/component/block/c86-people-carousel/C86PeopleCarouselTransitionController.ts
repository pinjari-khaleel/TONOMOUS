import AbstractTransitionController from '../../AbstractTransitionController';
import C86PeopleCarousel from './C86PeopleCarousel.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import { slideFadeIn } from '../../../animation/slideFadeIn';
import A03Heading from '../../atom/a03-heading/A03Heading';
import M54BusinessCard from '../../molecule/m54-business-card/M54BusinessCard';
import M02Button from '../../molecule/m02-button/M02Button';

class C86PeopleCarouselTransitionController extends AbstractTransitionController<
  C86PeopleCarousel
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C86PeopleCarousel,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const heading = parent.getElement(`[data-header] [data-component="${A03Heading.displayName}"]`);

    heading && timeline.add(slideFadeIn([heading], 0.8, 0), 0.2);

    const paginationItems = parent.getElements(`[data-pagination]`);
    const imageElements = parent.getElements(
      `[data-component="${M54BusinessCard.displayName}"] [data-image]`,
    );
    const contentElements = parent.getElements(
      `[data-component="${M54BusinessCard.displayName}"] [data-card-content]`,
    );
    const buttonElements = parent.getElements(
      `[data-controls] [data-component="${M02Button.displayName}"]`,
    );

    paginationItems && timeline.add(slideFadeIn(paginationItems, 0.8, 0.15), 0.2);

    imageElements.length > 0 &&
      timeline.staggerFromTo(
        imageElements,
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
        0.3,
      );

    buttonElements && timeline.add(slideFadeIn(buttonElements, 0.8, 0.15), 0.3);

    contentElements.length > 0 &&
      timeline.staggerFromTo(
        contentElements,
        0.8,
        {
          x: 80,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        0.2,
        0.4,
      );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C86PeopleCarousel,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C86PeopleCarousel,
    id: string,
  ): void {}
}

export default C86PeopleCarouselTransitionController;
