import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { TweenLite } from 'gsap';
import Draggable from 'gsap/Draggable';
import { isRtl } from '../../../util/rtlUtils';
import C85LogoMarqueeTransitionController from './C85LogoMarqueeTransitionController';

import './c85-logo-marquee.scss';

export default class C85LogoMarquee extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c85-logo-marquee';
  public readonly transitionController: C85LogoMarqueeTransitionController;
  private readonly carousel = this.getElement('[data-carousel]');
  private readonly content = this.getElement('[data-content]');
  private draggableInstance: Draggable | null = null;
  private isRtlDirection: boolean = isRtl();

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C85LogoMarqueeTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
    this.createDraggableInstance();
    this.addEventListeners();
  }

  public addEventListeners(): void {
    this.addDisposableEventListener(window, 'resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    TweenLite.set(this.carousel, {
      x: 0,
    });
    this.draggableInstance?.applyBounds(this.getBounds());
  }

  /**
   * Calculate the bounds in which the carousel can be dragged.
   *
   * @returns {minX:number; maxX:number} The min and max values on which can be dragged.
   */
  private getBounds(): { minX: number; maxX: number } {
    if (!this.carousel || !this.content) {
      return {
        minX: 0,
        maxX: 0,
      };
    }
    const offset = this.carousel.clientWidth - this.content.clientWidth;
    const bounds = offset > 0 ? offset : 0;
    return {
      maxX: this.isRtlDirection ? bounds : 0,
      minX: this.isRtlDirection ? 0 : bounds * -1,
    };
  }

  private createDraggableInstance(): void {
    [this.draggableInstance] = Draggable.create(this.carousel, {
      type: 'x',
      dragClickables: true,
      allowContextMenu: true,
      zIndexBoost: false,
      bounds: this.getBounds(),
    });
  }
}
