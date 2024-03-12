import AbstractTransitionController from '../../AbstractTransitionController';
import C30Downloads from './C30Downloads.lazy';
import { TimelineMax } from 'gsap';
import M05DownloadItem from 'app/component/molecule/m05-download-item/M05DownloadItem';
import eases from 'app/animation/eases';

class C30DownloadsTransitionController extends AbstractTransitionController<C30Downloads> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C30Downloads,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    if (parent.element.hasAttribute('data-scroll-component')) {
      const downloads = parent.getElements(`[data-component="${M05DownloadItem.displayName}"]`);
      const heading = parent.getElement('[data-downloads-heading]');

      if (heading) {
        timeline.from(heading, 0.4, {
          opacity: 0,
          y: 50,
        });
      }

      timeline.staggerFromTo(
        downloads.filter((element) => element !== null),
        0.6,
        {
          x: 100,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
          stagger: {
            amount: 0.2,
          },
        },
        0,
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C30Downloads,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C30Downloads,
    id: string,
  ): void {}
}

export default C30DownloadsTransitionController;
