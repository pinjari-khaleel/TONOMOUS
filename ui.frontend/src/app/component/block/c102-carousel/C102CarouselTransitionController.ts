import AbstractTransitionController from '../../AbstractTransitionController';
import C102Carousel from './C102Carousel.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import { slideFadeIn } from '../../../animation/slideFadeIn';
import A03Heading from '../../atom/a03-heading/A03Heading';
import M54BusinessCard from '../../molecule/m54-business-card/M54BusinessCard';
import M02Button from '../../molecule/m02-button/M02Button';

class C102CarouselTransitionController extends AbstractTransitionController<C102Carousel> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C102Carousel,
    id: string,
  ): void {}

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C102Carousel,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C102Carousel,
    id: string,
  ): void {}
}

export default C102CarouselTransitionController;
