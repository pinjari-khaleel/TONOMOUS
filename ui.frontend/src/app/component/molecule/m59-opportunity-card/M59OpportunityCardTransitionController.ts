import AbstractTransitionController from "../../AbstractTransitionController";
import M59OpportunityCard from './M59OpportunityCard'
import { TimelineMax } from "gsap";

class M59OpportunityCardTransitionController extends AbstractTransitionController<M59OpportunityCard> {
protected setupTransitionInTimeline(timeline: TimelineMax, parent: M59OpportunityCard, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id)
  }

protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M59OpportunityCard,
  id: string,
): void {}

protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M59OpportunityCard,
  id: string,
): void {}
}

export default M59OpportunityCardTransitionController;
