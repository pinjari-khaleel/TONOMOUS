import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { cleanElement, getComponentForElement, initComponents } from 'muban-core';
import { getAppComponent } from '../../../util/getElementComponent';
import { addEscapeKeyListener } from '../../../util/keyboardUtils';
import App from '../../layout/app/App';
import type VideoControls from '../o01-video/component/organism/video-controls/VideoControls';
import VideoEvent from '../o01-video/event/VideoEvent';
import type O01Video from '../../organism/o01-video/O01Video';
import O02VideoOverlayTransitionController from './O02VideoOverlayTransitionController';
import isEmpty from 'lodash/isEmpty';
import TrackingEvent, { TrackingEventNames } from '../../../util/TrackingEvent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { OVERLAY_ACTIONS, VIDEO_ACTIONS } from 'app/component/block/s09-overlay/S09Overlay.types';
import { VIDEO } from 'app/util/overlayActionTypes';

export default class O02VideoOverlay extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o02-video-overlay';

  public readonly transitionController: O02VideoOverlayTransitionController;

  private readonly videoContainer = this.getElement('[data-video-container]');
  private app: App | null = null;
  private videoPlayer: O01Video | null = null;
  private videoControls: VideoControls | null = null;

  private readonly closeButton: HTMLButtonElement | null = this.getElement('[data-close-button]');
  private readonly mask: HTMLElement | null = this.getElement('[data-mask]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O02VideoOverlayTransitionController(this);

    addEscapeKeyListener(this.dispatchCloseAction);
  }

  private set scrollEnabled(isEnabled: boolean) {
    if (this.app === null) {
      throw new Error('App was not found');
    }
    this.app.toggleScroll(isEnabled);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();

    [this.closeButton, this.mask].forEach((element) => {
      if (element) {
        this.addDisposableEventListener(element, 'click', this.dispatchCloseAction);
      }
    });

    // Subscribe to overlay events
    this.addDisposableEventListener(this.app?.element, 'overlayAction', async (event) => {
      await this.handleAction((event as unknown as CustomEvent).detail);
    });
  }

  private dispatchCloseAction = () => {
    this.trackCloseEvent();
    this.app?.overlay?.dispatchAction({ type: VIDEO.CLOSE });
  };

  public handleAction = async (action: VIDEO_ACTIONS) => {
    switch (action.type) {
      case VIDEO.STANDARD_DYNAMIC: {
        const { template, data, options } = action.payload;

        if (options?.classnames) {
          options.classnames.forEach((name) => this.element.classList.add(name));
        }

        const markup = template(data);

        await this.openDynamic(markup);
        break;
      }
      case VIDEO.CLOSE: {
        await this.close();
        break;
      }
    }
  };

  public async openDynamic(markup: string): Promise<void> {
    if (this.videoContainer == null) {
      throw new Error('this.videoContainer is undefined');
    }

    this.scrollEnabled = false;
    this.videoContainer.innerHTML = markup;
    initComponents(this.videoContainer);

    const videoControlsElement = <HTMLElement>(
      this.videoContainer.querySelector(`[data-component="video-controls"]`)
    );

    const videoPlayerElement = <HTMLElement>(
      this.videoContainer.querySelector(`[data-component="o01-video"]`)
    );

    this.videoPlayer = getComponentForElement<O01Video>(videoPlayerElement);
    this.videoControls = getComponentForElement<VideoControls>(videoControlsElement);

    this.addEndListener();

    return this.transitionIn();
  }

  private addEndListener() {
    if (this.videoPlayer === null) {
      throw new Error('Video player was not found');
    }

    this.addDisposableEventListener(this.videoPlayer.dispatcher, VideoEvent.ENDED, () =>
      this.app?.overlay?.dispatchAction({ type: VIDEO.CLOSE }),
    );
  }

  public async close(): Promise<void> {
    if (this.videoPlayer === null) {
      throw new Error('Video Player was not found');
    }

    if (this.videoContainer === null) {
      throw new Error('Video container was not found');
    }

    await this.videoPlayer.player.pause();
    this.videoPlayer.player.clearTimeupdateInterval();

    await this.transitionOut();
    cleanElement(this.videoContainer);
    this.scrollEnabled = true;
  }

  trackCloseEvent() {
    const controlsElement = this.getElement<HTMLElement>('[data-component="video-controls"]');

    const eventTrackingData =
      controlsElement && JSON.parse(controlsElement.dataset['eventTracking'] || '{}');

    !isEmpty(eventTrackingData) &&
      TrackingEvent({
        event: TrackingEventNames.VIDEO_CLOSE,
        video: {
          titleInEnglish: eventTrackingData.video.titleInEnglish,
          title: eventTrackingData.video.title,
          src: eventTrackingData.video.src,
        },
      });
  }
}
