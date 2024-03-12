import { StateClassNames } from 'app/data/enum/StateClassNames';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C79WebglEffectHeroTransitionController from './C79WebglEffectHeroTransitionController';
import { getWebglApplication } from '../../../util/getWebglApplication';
import WebGLApplication from '../../../webgl/WebGLApplication';
import Tween from 'mediamonks-webgl/utils/animation/Tween';
import Time from 'mediamonks-webgl/renderer/core/Time';
import { TweenLite } from 'gsap';
import eases from '../../../animation/eases';
import Vector2 from '../../../webgl/lib/renderer/math/Vector2';
import Polygon from '../../../webgl/Polygon';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import O60HeroContent from '../../organism/o60-hero-content/O60HeroContent';
import { TransitionDirection } from 'transition-controller';
import { IS_RTL } from '../../../util/rtlUtils';
import S09Overlay from '../s09-overlay/S09Overlay';

import './c79-webgl-effect-hero.scss';

const SCALE_GOAL = 2.5;

export default class C79WebglEffectHero extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c79-webgl-effect-hero';
  private webglApp!: WebGLApplication;
  private loopingVideo: HTMLVideoElement | null = this.getElement('[data-video]');
  private overlayActivated = false;
  private videoMaskButton: HTMLButtonElement = this.getElement(
    '[data-video-mask] button',
  ) as HTMLButtonElement;
  private videoPlayButton: HTMLButtonElement = this.getElement(
    '[data-play-button]',
  ) as HTMLButtonElement;
  private videoMuteButton = <HTMLButtonElement>this.getElement('[data-mute-button]');
  public readonly transitionController: C79WebglEffectHeroTransitionController;

  private readonly shapeBorder = this.getElement(
    IS_RTL ? '[data-shape-border]' : '[data-shape-border] svg',
  );

  private pentagonTween = new Tween(0);
  private pentagonScale = 1;
  private pentagon = new Polygon([
    [-0.3888, -0.121],
    [0.055, -0.4485],
    [0.4956, -0.0085],
    [0.0548, 0.4318],
    [-0.4961, 0.3218],
  ]);

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C79WebglEffectHeroTransitionController(this);
  }

  public async adopted() {
    this.webglApp = await getWebglApplication();

    if (!this.webglApp) return;

    if (this.loopingVideo) {
      this.loopingVideo.addEventListener(
        'canplay',
        () => {
          this.loopingVideo?.play();
        },
        true,
      );
      this.webglApp.setVideoElement(this.loopingVideo);
      this.webglApp.setMouseEffectStrength(0);
    }

    this.addEventListeners();

    // Start animation loop to update pentagon
    this.updatePentagon();
  }

  public enterView(): void {
    this.transitionIn();

    if (!this.webglApp) return;

    if (this.pentagonScale >= 1) {
      this.webglApp.setMouseEffectStrength(0.5);
    } else {
      this.webglApp.setMouseEffectStrength(0);
      this.pentagonTween = new Tween(0);
      this.pentagonScale = 1;
    }

    this.webglApp.transitionToIntro(0.6, () => {});

    if (!this.videoPlayButton.classList.contains(StateClassNames.HIDDEN)) {
      if (this.loopingVideo) {
        this.loopingVideo.play();
      }
      TweenLite.to([this.videoPlayButton, this.videoMuteButton], 0.5, {
        autoAlpha: 1,
        ease: eases.VinnieInOut,
      });
    }
  }

  public leaveView(): void {
    this.webglApp.setMouseEffectStrength(0.5);

    if (!this.videoPlayButton.classList.contains(StateClassNames.HIDDEN)) {
      if (this.loopingVideo) {
        this.loopingVideo.pause();
      }
      TweenLite.to([this.videoPlayButton, this.videoMuteButton], 0.5, {
        autoAlpha: 0,
        ease: eases.VinnieInOut,
      });
    }
  }

  private updatePentagon = (): void => {
    const isDesktop = deviceStateTracker.currentDeviceState.state > mq.deviceState.MEDIUM;

    let pentagon = new Polygon(this.pentagon.toArray());

    // Scale shape to aspect ratio
    pentagon.multiply(new Vector2(1, this.webglApp.renderer.aspectRatio));
    pentagon.multiplyScalar(this.pentagonScale);

    if (isDesktop) {
      pentagon.multiplyScalar(0.58125);
      pentagon.translate(new Vector2(0.633, 0.49));
    } else {
      pentagon.multiplyScalar(1.5);
      pentagon.translate(new Vector2(0.5, 0.4));
    }

    const scrollProgress = window.scrollY / window.innerHeight;
    pentagon.translate(new Vector2(0, -scrollProgress));

    if (IS_RTL) {
      pentagon.multiply(new Vector2(-1, 1)).translate(new Vector2(1, 0));
    }

    this.webglApp.setPentagonPoints(pentagon.toArray());

    requestAnimationFrame(this.updatePentagon);
  };

  private addEventListeners(): void {
    this.addDisposableEventListener(
      this.videoMaskButton,
      'click',
      this.onVideoMaskButtonClick.bind(this),
    );

    this.addDisposableEventListener(
      this.videoPlayButton,
      'click',
      this.onVideoPlayButtonClick.bind(this),
    );

    this.addDisposableEventListener(
      this.videoMuteButton,
      'click',
      this.onVideoMuteButtonClick.bind(this),
    );

    const overlayElement = document.querySelector(`[data-component=${S09Overlay.displayName}]`);
    if (overlayElement) {
      const options = {
        attributes: true,
      };

      const observer = new MutationObserver((mutations, mut) => {
        if (this.overlayActivated) {
          const classMutation = mutations.find((mutation) => {
            return mutation.attributeName === 'class';
          });
          if (classMutation && this.loopingVideo) {
            this.loopingVideo.play();
          }
        }
      });
      observer.observe(overlayElement, options);
    }
  }

  private progressTween = (): void => {
    const dt = Time.instance.deltaTime;
    this.pentagonTween.update(dt);
  };

  private onVideoPlayButtonClick() {
    if (this.loopingVideo) {
      this.loopingVideo.muted = true;
      this.videoMuteButton.classList.add(StateClassNames.MUTED);
      this.loopingVideo.pause();
      this.overlayActivated = true;
    }
  }

  private get isLoopingVideoMuted(): boolean {
    return this.loopingVideo?.muted ?? true;
  }

  private onVideoMuteButtonClick() {
    if (this.loopingVideo) {
      this.loopingVideo.muted = !this.isLoopingVideoMuted;
      this.videoMuteButton.classList.toggle(StateClassNames.MUTED, this.isLoopingVideoMuted);
    }
  }

  private onVideoMaskButtonClick() {
    if (this.loopingVideo) {
      this.loopingVideo.muted = false;
    }
    this.videoPlayButton.classList.remove(StateClassNames.HIDDEN);
    this.videoMuteButton.classList.remove(StateClassNames.HIDDEN);

    this.pentagonTween.to(SCALE_GOAL, 2, (value: number) => {
      this.pentagonScale = 1 + value;

      const tweenOptions: Record<string, any> = {
        scale: this.pentagonScale,
        scaleY: IS_RTL ? -this.pentagonScale : this.pentagonScale,

        x: IS_RTL ? '50%' : 0,
        y: IS_RTL ? '-50%' : 0,
      };

      if (value === SCALE_GOAL) {
        tweenOptions.opacity = 0;
      }

      TweenLite.set(this.shapeBorder, tweenOptions);

      requestAnimationFrame(this.progressTween);
    });

    // Start tween
    this.progressTween();

    this.webglApp.setMouseEffectStrength(0.5);

    // Hide elements when video is playing
    const heroContent = this.getElement(`[data-component="${O60HeroContent.displayName}"]`);
    heroContent &&
      this.transitionController.getTimeline(heroContent, TransitionDirection.OUT).restart();

    TweenLite.to(this.videoMaskButton, 0.5, {
      autoAlpha: 0,
      scale: 1.2,
      ease: eases.VinnieInOut,
    });
  }
}
