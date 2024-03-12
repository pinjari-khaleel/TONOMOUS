import AbstractTransitionController from '../../AbstractTransitionController';
import O60HeroContent from './O60HeroContent';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import M34ComponentBackground from '../../molecule/m34-component-background/M34ComponentBackground';
import M02Button from '../../molecule/m02-button/M02Button';
import { isEditor } from '../../../util/aemEditorUtils';
import M53TileCta from '../../molecule/m53-tile-cta/M53TileCta';
import eases from '../../../animation/eases';
import A04Eyebrow from '../../atom/a04-eyebrow/A04Eyebrow';
import { slideFadeIn, slideScaleFadeIn } from '../../../animation/slideFadeIn';
import M58PillarCta from 'app/component/molecule/m58-pillar-cta/M58PillarCta';

class O60HeroContentTransitionController extends AbstractTransitionController<O60HeroContent> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O60HeroContent,
    id: string,
  ): void {
    const isAemEditor = isEditor();
    if (isAemEditor) return;

    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    const background = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );
    const buttonEyebrow = parent.getElement(
      `[data-button-wrapper] > [data-component="${A04Eyebrow.displayName}"]`,
    );

    background && timeline.add(this.getTimeline(background));

    title && timeline.add(this.getTimeline(title), '=-0.8');

    buttonEyebrow && timeline.add(slideFadeIn([buttonEyebrow]), '=-0.5');

    timeline
      .add(
        slideFadeIn(parent.getElements(`[data-component="${M02Button.displayName}"]`), 1, 0.2),
        '=-0.5',
      )
      .add(
        slideFadeIn(parent.getElements(`[data-component="${M58PillarCta.displayName}"]`), 1, 0.2),
        '=-0.5',
      )
      .add(
        slideScaleFadeIn(parent.getElements(`[data-component="${M53TileCta.displayName}"]`), 1),
        '=-0.75',
      );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O60HeroContent,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O60HeroContent,
    id: string,
  ): void {}
}

export default O60HeroContentTransitionController;
