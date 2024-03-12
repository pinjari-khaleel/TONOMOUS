import { TimelineMax } from 'gsap';
import S10TonomusFooter from './S10TonomusFooter';
import AbstractTransitionController from '../../AbstractTransitionController';
import eases from '../../../animation/eases';

class S10TonomusFooterTransitionController extends AbstractTransitionController<S10TonomusFooter> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: S10TonomusFooter,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const sitemapItems = parent.getElements('[data-sitemap-item]');
    const socialLabel = parent.getElement('.b-tonomusFooter__social [data-component="a07-label"]');
    const socialItems = parent.getElements('[data-social-item]');
    const footerLogo = parent.getElement('[data-footer-logo]');
    const marginalia = parent.getElement('[data-marginalia]');

    const elements = [...sitemapItems, socialLabel, ...socialItems, footerLogo, marginalia];

    if (elements && sitemapItems.length > 0) {
      timeline.staggerFromTo(
        elements,
        0.6,
        {
          x: 100,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          clearProps: 'x,opacity,visibility',
          ease: eases.VinnieInOut,
          stagger: {
            amount: 0.6,
          },
        },
        0,
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: S10TonomusFooter,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: S10TonomusFooter,
    id: string,
  ): void {}
}

export default S10TonomusFooterTransitionController;
