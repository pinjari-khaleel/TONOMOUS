import AbstractTransitionController from '../../AbstractTransitionController';
import C79WebglEffectHero from './C79WebglEffectHero.lazy';
import { TimelineMax } from 'gsap';
import { isEditor } from '../../../util/aemEditorUtils';
import { slideFadeIn } from '../../../animation/slideFadeIn';
import M02Button from '../../molecule/m02-button/M02Button';
import O60HeroContent from '../../organism/o60-hero-content/O60HeroContent';

class C79WebglEffectHeroTransitionController extends AbstractTransitionController<
  C79WebglEffectHero
> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C79WebglEffectHero,
    id: string,
  ): void {
    const isAemEditor = isEditor();
    if (isAemEditor) return;

    super.setupTransitionInTimeline(timeline, parent, id);

    const heroContent = parent.getElement(`[data-component="${O60HeroContent.displayName}"]`);

    heroContent && timeline.add(this.getTimeline(heroContent));

    const buttonElements = parent.getElements(`[data-component="${M02Button.displayName}"]`);

    buttonElements.length > 0 && timeline.add(slideFadeIn(buttonElements, 1, 0.2), 0);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C79WebglEffectHero,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C79WebglEffectHero,
    id: string,
  ): void {}
}

export default C79WebglEffectHeroTransitionController;
