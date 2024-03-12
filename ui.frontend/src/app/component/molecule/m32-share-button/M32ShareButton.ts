import AbstractComponent from 'app/component/AbstractComponent';
import copy from 'copy-to-clipboard';
import { TimelineMax, TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import TrackingEvent from '../../../util/TrackingEvent';

export default class M32ShareButton extends AbstractComponent {
  public static readonly displayName: string = 'm32-share-button';
  private readonly successMessage = this.getElement('[data-success-message]');

  constructor(el: HTMLElement) {
    super(el);

    this.element &&
      this.addDisposableEventListener(this.element, 'click', this.openShareLink.bind(this));

    this.hideMessage();
  }

  private openShareLink(e: MouseEvent): void {
    const eventTracking = this.element.dataset.eventTracking;

    if (this.element.dataset.shareType === 'clipboard') {
      e.preventDefault();
      this.copyLinkToClipBoard();
    }

    eventTracking && TrackingEvent(JSON.parse(eventTracking));
  }

  private copyLinkToClipBoard(): void {
    const href = this.element.getAttribute('href');
    href && copy(href);
    this.showSuccessMessage();
  }

  private hideMessage(): void {
    if (this.successMessage) {
      TweenMax.set(this.successMessage, {
        opacity: 0,
        xPercent: -100,
      });
    }
  }
  private showSuccessMessage(): void {
    if (this.successMessage) {
      const tl = new TimelineMax({});

      tl.to(this.successMessage, 0.4, {
        autoAlpha: 1,
        xPercent: 0,
        ease: eases.VinnieInOut,
      });
      tl.to(
        this.successMessage,
        0.4,
        {
          autoAlpha: 0,
          xPercent: -100,
          ease: eases.VinnieInOut,
        },
        '+=1.2',
      );
    }
  }
}
