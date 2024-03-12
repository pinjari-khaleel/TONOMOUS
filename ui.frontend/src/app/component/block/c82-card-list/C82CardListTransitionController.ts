import AbstractTransitionController from '../../AbstractTransitionController';
import C82CardList from './C82CardList';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from 'app/component/molecule/m04-component-header/M04ComponentHeader';
import eases from '../../../animation/eases';

class C82CardListTransitionController extends AbstractTransitionController<C82CardList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C82CardList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);

    if (title) {
      timeline.add(this.getTimeline(title));
    }

    const items = parent.getElements('[data-item]');

    items.length > 0 &&
      timeline.staggerFromTo(
        items,
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
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C82CardList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C82CardList,
    id: string,
  ): void {}
}

export default C82CardListTransitionController;
