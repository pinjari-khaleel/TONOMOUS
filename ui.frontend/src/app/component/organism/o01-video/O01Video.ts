import AbstractComponent from 'app/component/AbstractComponent';
import { getComponentForElement } from 'muban-core';
import { isSafari } from '../../../util/browserUtils';
import { O01VideoConfig } from './O01Video.types';
import {
  getFullscreenElement,
  isFullscreenEnabled,
  requestFullscreen,
} from '../../../util/fullscreenUtils';
import AbstractVideo from './AbstractVideo';
import NativeVideo from './component/atom/native-video/NativeVideo';
import YoutubeVideo from './component/atom/youtube-video/YoutubeVideo';
import VideoControls from './component/organism/video-controls/VideoControls';

export default class O01Video extends AbstractComponent {
  public static readonly displayName: string = 'o01-video';

  public readonly player: AbstractVideo;
  public readonly props: Partial<O01VideoConfig>;
  private videoControls: VideoControls | null = null;

  private readonly closeButton = this.getElement<HTMLButtonElement>('.js-close-button');

  constructor(el: HTMLElement) {
    super(el);

    this.props = this.element.dataset.props ? JSON.parse(this.element.dataset.props) : {};

    this.player = (this.getComponent<AbstractVideo>(NativeVideo.displayName) ||
      this.getComponent<AbstractVideo>(YoutubeVideo.displayName))!;

    this.closeButton &&
      this.addDisposableEventListener(
        this.closeButton,
        'click',
        this.handleCloseButtonClick.bind(this),
      );

    document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));

    const videoControlsElement = <HTMLElement>(
      this.element.querySelector(`[data-component="${VideoControls.displayName}"]`)
    );
    this.videoControls = getComponentForElement<VideoControls>(videoControlsElement);
  }

  public async requestFullscreen() {
    if (!isFullscreenEnabled()) {
      throw new Error('Unable to request fullscreen');
    }

    if (isSafari()) {
      this.element.webkitRequestFullscreen();
      return;
    }

    await requestFullscreen(this.element);
  }

  private handleCloseButtonClick() {
    this.player.pause();

    const fullscreenElement = getFullscreenElement();

    if (fullscreenElement === this.element) {
      document.exitFullscreen();
    }
  }

  private handleFullscreenChange() {
    const fullscreenElement = getFullscreenElement();

    this.videoControls && this.videoControls.toggleFullscreenButtons(fullscreenElement !== null);
  }
}
