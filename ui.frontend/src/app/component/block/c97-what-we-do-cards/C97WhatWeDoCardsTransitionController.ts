import AbstractTransitionController from "../../AbstractTransitionController";
import C97WhatWeDoCards from './C97WhatWeDoCards.lazy'
import { TimelineMax } from "gsap";

class C97WhatWeDoCardsTransitionController extends AbstractTransitionController<C97WhatWeDoCards> {
protected setupTransitionInTimeline(timeline: TimelineMax, parent: C97WhatWeDoCards, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id)
  }

protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C97WhatWeDoCards,
  id: string,
): void {}

protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C97WhatWeDoCards,
  id: string,
): void {}
}

export default C97WhatWeDoCardsTransitionController;
