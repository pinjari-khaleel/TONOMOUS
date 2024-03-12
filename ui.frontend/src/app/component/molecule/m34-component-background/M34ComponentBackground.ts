import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import M34ComponentBackgroundTransitionController from './M34ComponentBackgroundTransitionController';
import { TweenMax } from 'gsap';
import lerp from 'lerp';
import type ImageEffect from '../../../effects/ImageEffect';
import type { EffectType } from '../../../effects/ImageEffect';
import A01Image from '../../atom/a01-image/A01Image';

export default class M34ComponentBackground extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm34-component-background';

  public enterViewThreshold = 0;

  private readonly stickyBackgroundElement = this.getElement('[data-sticky-background]');
  private readonly backgroundElement = this.getElement('[data-background]');

  private inView: boolean = false;

  public readonly transitionController: M34ComponentBackgroundTransitionController;

  private animationFrameReference = 0;

  private yValue = 0;

  private effect = (this.element.dataset.effect ?? null) as EffectType | null;
  private effectController: ImageEffect | null = null;
  private imageSrc = this.element.dataset.imageSrc ?? null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new M34ComponentBackgroundTransitionController(this);
  }

  public async adopted() {
    this.tick();
    if (this.backgroundElement && this.effect && this.imageSrc)
      await this.initEffect(this.backgroundElement, this.effect, this.imageSrc);
  }

  private async initEffect(
    wrapper: HTMLElement,
    effect: EffectType,
    imageSrc: string,
  ): Promise<void> {
    const imageElement = this.getElement(`[data-component="${A01Image.displayName}"]`);

    try {
      if (imageElement)
        TweenMax.set(imageElement, {
          display: 'none',
        });

      const { default: ImageEffect } = await import(
        /* webpackChunkName: "image-effect" */ '../../../effects/ImageEffect'
      );

      this.effectController = new ImageEffect(wrapper, [imageSrc], effect, true);
      await this.effectController.init();
    } catch {
      if (imageElement)
        TweenMax.set(imageElement, {
          clearProps: 'display',
        });
    }
  }

  public enterView(): void {
    this.inView = true;
    super.enterView();
  }

  public leaveView(): void {
    this.inView = false;
    super.leaveView();
  }

  private tick(): void {
    if (this.inView && this.stickyBackgroundElement) {
      const { offsetHeight: wrapperHeight, offsetTop: parentTop } = this.element
        .parentNode as HTMLElement;
      const { offsetHeight: elementHeight } = this.stickyBackgroundElement;
      const top = parentTop - scrollY;

      const yValue =
        top > 0 ? -top / 2 : Math.max(0, Math.min(wrapperHeight - elementHeight, top * -1));

      this.yValue = lerp(this.yValue, yValue, 0.9);

      TweenMax.set(this.stickyBackgroundElement, {
        y: this.yValue,
      });
    }

    this.animationFrameReference = requestAnimationFrame(this.tick.bind(this));
  }

  public dispose(): void {
    cancelAnimationFrame(this.animationFrameReference);
    this.effectController?.dispose();
  }
}
