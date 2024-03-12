import App from '../../layout/app/App';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O24PopupMessageTransitionController from './O24PopupMessageTransitionController';
import { getAppComponent } from '../../../util/getElementComponent';
import { cleanElement, getComponentForElement, initComponents } from 'muban-core';
import { POPUP } from 'app/util/overlayActionTypes';
import { POPUP_ACTIONS } from 'app/component/block/s09-overlay/S09Overlay.types';

export default class O24PopupMessage extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o24-popup-message';
  public readonly transitionController: O24PopupMessageTransitionController;

  public overlay: HTMLElement | null = null;

  public readonly popupContainer = this.getElement('[data-popup-container]');
  private app: App | null = null;
  private readonly closeButton: HTMLButtonElement | null = this.getElement('[data-close-button]');
  private readonly mask: HTMLElement | null = this.getElement('[data-mask]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O24PopupMessageTransitionController(this);
  }

  public async adopted() {
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
    this.app?.overlay?.dispatchAction({ type: POPUP.CLOSE });
  };

  public handleAction = async (action: POPUP_ACTIONS) => {
    switch (action.type) {
      case POPUP.STANDARD_DYNAMIC: {
        const { template, data, options } = action.payload;

        if (options?.classnames) {
          options.classnames.forEach((name) => this.element.classList.add(name));
        }

        const markup = template(data);

        await this.openDynamic(markup);
        break;
      }
      case POPUP.CLOSE: {
        await this.close();

        break;
      }
    }
  };

  public async openDynamic(markup: string): Promise<void> {
    if (this.popupContainer == null) {
      throw new Error('this.popupContainer is undefined');
    }

    this.popupContainer.innerHTML = markup;
    initComponents(this.popupContainer);

    this.scrollEnabled = false;

    return this.transitionIn();
  }

  public async close(): Promise<void> {
    if (!this.app) throw new Error('The app component cannot be found');

    this.popupContainer && cleanElement(this.popupContainer);

    this.scrollEnabled = true;

    this.app.transformCursor(false);

    await this.transitionOut();
  }

  private set scrollEnabled(isEnabled: boolean) {
    if (!this.app) throw new Error('The app component cannot be found');
    this.app.toggleScroll(isEnabled);
  }
}
