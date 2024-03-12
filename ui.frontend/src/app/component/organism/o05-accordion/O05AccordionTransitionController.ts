import AbstractTransitionController from '../../AbstractTransitionController';
import O05Accordion from './O05Accordion';
import { TimelineMax } from 'gsap';

class O05AccordionTransitionController extends AbstractTransitionController<O05Accordion> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O05Accordion,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O05Accordion,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O05Accordion,
    id: string,
  ): void {}
}

export default O05AccordionTransitionController;
