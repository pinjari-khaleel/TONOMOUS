import AbstractComponent from 'app/component/AbstractComponent';
import O01Video from '../o01-video/O01Video';
import VideoEvent from '../o01-video/event/VideoEvent';
import { TweenMax } from 'gsap';
import { toggleInert } from '../../../util/toggleInert';

export default class O03VideoPlayer extends AbstractComponent {
  public static readonly displayName: string = 'o03-video-player';
  public readonly videoPlayer = this.getComponent<O01Video>(O01Video.displayName);

  private readonly posterElement = this.getElement('[data-video-poster]');
  private readonly contentElement = this.getElement('[data-video-content]');

  constructor(el: HTMLElement) {
    super(el);

    if (this.videoPlayer === null) {
      throw new Error('Video component does not exist');
    }

    this.addDisposableEventListener(
      this.videoPlayer.dispatcher,
      VideoEvent.PLAYING,
      this.handleVideoPlaying.bind(this),
    );

    this.addDisposableEventListener(
      this.videoPlayer.dispatcher,
      VideoEvent.ENDED,
      this.handleVideoClosing.bind(this),
    );

    toggleInert(this.videoPlayer.element, true);
    this.setPosterVisibility(true);
  }

  public play(): void {
    this.videoPlayer && this.videoPlayer.player.play();
  }

  public close(): void {
    this.videoPlayer && this.videoPlayer.player.pause();
    this.setPosterVisibility(true);
  }

  private handleVideoClosing(event: VideoEvent): void {
    this.setPosterVisibility(true);

    this.dispatcher.dispatchEvent(event);
  }

  private handleVideoPlaying(event: VideoEvent): void {
    this.setPosterVisibility(false);

    this.dispatcher.dispatchEvent(event);
  }

  private setPosterVisibility(isVisible: boolean): void {
    if (this.contentElement === null) {
      throw new Error('The content element does not exist');
    }

    if (this.videoPlayer === null) {
      throw new Error('The video player does not exist');
    }

    const autoAlpha = isVisible ? 1 : 0;

    if (this.posterElement) {
      TweenMax.to(this.posterElement, 0.2, { autoAlpha });
    }

    TweenMax.to(this.contentElement, 0.2, { autoAlpha });

    toggleInert(this.videoPlayer.element, isVisible);
  }
}
