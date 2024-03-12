import AbstractTransitionController from '../../AbstractTransitionController';
import M34ComponentBackground from './M34ComponentBackground';
import { TimelineMax, TweenLite } from 'gsap';
import A01Image from '../../atom/a01-image/A01Image';
import eases from '../../../animation/eases';
import A19Video from '../../atom/a19-video/A19Video';

class M34ComponentBackgroundTransitionController extends AbstractTransitionController<
  M34ComponentBackground
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: M34ComponentBackground,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    if (parent.element.hasAttribute('data-disable-transition')) {
      return;
    }

    const stickyBackgroundElement = parent.getElement('[data-sticky-background]');

    if (!stickyBackgroundElement) {
      const counter = { x: 1 };
      const image = parent.getElement(`[data-component="${A01Image.displayName}"]`);
      const video = parent.getElement(`[data-component="${A19Video.displayName}"]`);

      image && timeline.add(this.getTimeline(image));

      timeline.fromTo(
        counter,
        0.85,
        {
          x: 1,
        },
        {
          x: 0,
          ease: eases.VinnieInOut,
          onUpdate: () => {
            const { innerHeight } = window;
            const { offsetHeight } = parent.element;
            image && TweenLite.set(image, { y: (innerHeight - offsetHeight) * counter.x });
          },
          onComplete: () => {
            image && TweenLite.set(image, { clearProps: 'y' });
          },
        },
        0.15,
      );

      if (video) {
        timeline.fromTo(
          video,
          1,
          { autoAlpha: 0, display: 'none' },
          { autoAlpha: 1, display: 'block' },
        );
      }
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M34ComponentBackground,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M34ComponentBackground,
    id: string,
  ): void {}
}

export default M34ComponentBackgroundTransitionController;
