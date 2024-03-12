import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { LIGHTBOX_ACTIONS } from 'app/component/block/s09-overlay/S09Overlay.types';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { LIGHTBOX } from 'app/util/overlayActionTypes';
import { cleanElement, initComponents } from 'muban-core';
import { getAppComponent } from '../../../util/getElementComponent';
import type App from '../../layout/app/App';
import O38LightboxTransitionController from './O38LightboxTransitionController';

export default class O38Lightbox extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o38-lightbox';

  public readonly transitionController: O38LightboxTransitionController;

  private readonly closeButton: HTMLButtonElement | null =
    this.element.querySelector('[data-close-button]');
  private readonly mask = this.element.querySelector('[data-lightbox-mask]');
  private readonly lightboxContainer = this.getElement('[data-lightbox-container]');

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O38LightboxTransitionController(this);
  }

  private addEventListeners() {
    [this.closeButton, this.mask].forEach((element) => {
      if (element) {
        this.addDisposableEventListener(element, 'click', this.dispatchCloseAction);
      }
    });
  }

  public async adopted() {
    this.app = await getAppComponent();

    this.addEventListeners();

    // Subscribe to overlay events
    this.addDisposableEventListener(this.app?.element, 'overlayAction', async (event) => {
      await this.handleAction((event as unknown as CustomEvent).detail);
    });
  }

  private dispatchCloseAction = () => {
    this.app?.overlay?.dispatchAction({ type: LIGHTBOX.CLOSE });
  };

  public handleAction = async (action: LIGHTBOX_ACTIONS) => {
    switch (action.type) {
      case LIGHTBOX.STANDARD_DYNAMIC: {
        const { template, data, options } = action.payload;

        if (options?.classnames) {
          options.classnames.forEach((name) => this.element.classList.add(name));
        }

        const markup = template(data);

        await this.openDynamic(markup);
        break;
      }
      case LIGHTBOX.CLOSE: {
        await this.closeLightbox();

        break;
      }
    }
  };

  public async openDynamic(markup: string): Promise<void> {
    if (this.lightboxContainer == null) {
      throw new Error('this.videoContainer is undefined');
    }
    this.element.classList.add(StateClassNames.OPEN);

    this.scrollEnabled = false;
    this.lightboxContainer.innerHTML = markup;
    initComponents(this.lightboxContainer);

    return this.transitionIn();
  }

  public async closeLightbox(): Promise<void> {
    if (this.lightboxContainer === null) {
      throw new Error('The lightbox container was not found');
    }
    this.element.classList.remove(StateClassNames.OPEN);
    this.scrollEnabled = true;

    cleanElement(this.lightboxContainer);
    return this.transitionOut();
  }

  private set scrollEnabled(isEnabled: boolean) {
    if (!this.app) throw new Error('The app component cannot be found');
    this.app.toggleScroll(isEnabled);
  }
}
