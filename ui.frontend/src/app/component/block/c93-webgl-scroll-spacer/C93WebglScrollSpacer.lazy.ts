import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C93WebglScrollSpacerTransitionController from './C93WebglScrollSpacerTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { getWebglApplication } from '../../../util/getWebglApplication';
import WebGLApplication from '../../../webgl/WebGLApplication';
import Color from 'mediamonks-webgl/renderer/math/Color';
import awaitElementComponent, { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';

import './c93-webgl-scroll-spacer.scss';

export default class C93WebglScrollSpacer extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c93-webgl-scroll-spacer';
  public enterViewThreshold = 0.3;
  public lastViewProgress = 0;
  public beyondComponent = false;
  public inTransition = false;
  public initialized = false;
  private webglApp!: WebGLApplication;
  private app: App | null = null;
  private previousWebglScrollSpacer!: Element | undefined;
  private previousWebglScrollSpacerComponent!: C93WebglScrollSpacer;
  public gradientColors: Array<string> = JSON.parse(this.element.dataset.gradientColors as string);
  public webglAsset = <string>this.element.dataset.asset;
  public readonly transitionController: C93WebglScrollSpacerTransitionController;
  private offsetElement = this.element.parentElement?.classList.contains('cmp')
    ? this.element.parentElement
    : this.element;

  constructor(el: HTMLElement) {
    super(el);

    ScrollToPlugin;
    this.transitionController = new C93WebglScrollSpacerTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.webglApp = await getWebglApplication();
    this.app = await getAppComponent();
    this.previousWebglScrollSpacer = this.getPreviousWebglScrollSpacer();
    const previousComponentElement = this.offsetElement.classList.contains('cmp')
      ? this.previousWebglScrollSpacer?.children[0]
      : this.previousWebglScrollSpacer;
    if (previousComponentElement) {
      awaitElementComponent(previousComponentElement as HTMLElement).then((component) => {
        this.previousWebglScrollSpacerComponent = component as C93WebglScrollSpacer;
      });
    }
  }

  private getPreviousWebglScrollSpacer() {
    let sibling = this.offsetElement.previousElementSibling;

    while (sibling) {
      if (
        sibling.classList.contains('b-webglScrollSpacer') ||
        sibling.children[0].classList.contains('b-webglScrollSpacer')
      ) {
        return sibling;
      }
      sibling = sibling.previousElementSibling;
    }
  }

  public enterView(): void {
    if (this.inTransition) return;
    if (this.app && !this.app.isScrolling) {
      this.inTransition = true;
      this.app.isScrolling = true;
      TweenMax.to(window, 1, {
        scrollTo: {
          y: this.beyondComponent
            ? this.offsetElement.offsetTop - this.offsetElement.offsetHeight
            : (this.offsetElement.nextElementSibling as HTMLElement).offsetTop,
          autoKill: false,
        },
        onComplete: () => {
          this.inTransition = false;
          if (this.app) {
            this.app.isScrolling = false;
          }
          this.beyondComponent = !this.beyondComponent;
        },
        ease: eases.VinnieInOut,
      });
    }
    if (this.webglApp) {
      let gradientColors: Array<Color> = [
        new Color().setHex(this.gradientColors[0]),
        new Color().setHex(this.gradientColors[1]),
        new Color().setHex(this.gradientColors[2]),
      ];
      let webglAsset = this.webglAsset || null;

      if (this.beyondComponent && this.previousWebglScrollSpacerComponent) {
        gradientColors = [
          new Color().setHex(this.previousWebglScrollSpacerComponent.gradientColors[0]),
          new Color().setHex(this.previousWebglScrollSpacerComponent.gradientColors[1]),
          new Color().setHex(this.previousWebglScrollSpacerComponent.gradientColors[2]),
        ];
        webglAsset = this.previousWebglScrollSpacerComponent.webglAsset || null;
      }
      if (
        this.gradientColors.length === 3 &&
        (this.previousWebglScrollSpacerComponent || !this.beyondComponent)
      ) {
        this.webglApp.transitionTo(gradientColors, webglAsset, 0.8, () => {});
      }
    }
  }

  public checkBeyondView(): void {
    this.beyondComponent = this.currentViewProgress > 0.1;
  }

  public inViewProgress(progress: number): void {
    if (!this.initialized) {
      if (progress > 0.4) {
        this.enterView();
      }
    }
    this.initialized = true;
    if (this.inTransition) return;
    if (progress > 0.99) {
      this.beyondComponent = true;
    }
    if (this.lastViewProgress > progress && progress > 0.4) {
      this.enterView();
    }
    this.lastViewProgress = progress;
  }

  public beyondView(): void {
    this.beyondComponent = true;
  }
}
