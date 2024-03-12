import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import {
  MODAL_ACTIONS,
  OPEN_MODAL_STANDARD_DYNAMIC,
  OVERLAY_ACTIONS,
} from 'app/component/block/s09-overlay/S09Overlay.types';
import M02Button from 'app/component/molecule/m02-button/M02Button';
import get from 'app/util/fetch/getRequest';
import { MODAL } from 'app/util/overlayActionTypes';
import { cleanElement, initComponents } from 'muban-core';
import { DisposableManager } from 'seng-disposable-manager';
import { StateClassNames, StateThemeClassNames } from '../../../data/enum/StateClassNames';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import O11ModalContentProps from '../o11-modal-content/O11Modal.types';
import O10ModalTransitionController from './O10ModalTransitionController';
import mq from '../../../data/shared-variable/media-queries.json';
import deviceStateTracker from 'app/util/deviceStateTracker';

export type BE_MODAL_ACTION_RESPONSE = {
  type: BE_MODAL_RESPONSE_ACTIONS;
  payload: {
    content: O11ModalContentProps;
    theme?: themeOptions;
    transparent?: boolean;
  };
};

type themeOptions = 'dark' | 'navy';

enum BE_MODAL_RESPONSE_ACTIONS {
  O11 = 'OPEN_MODAL_STANDARD',
}

const lazyModalContentTemplates = {
  [BE_MODAL_RESPONSE_ACTIONS.O11]: () =>
    import(
      '../../organism/o11-modal-content/o11-modal-content.hbs?include'
    ) as LoadTemplateImport<O11ModalContentProps>,
};
export default class O10Modal extends AbstractTransitionComponent {
  public static readonly displayName = 'o10-modal';
  public readonly transitionController: O10ModalTransitionController;

  private previousModalButtons: ReadonlyArray<HTMLButtonElement> | null = null;
  private readonly modalContainer = this.getElement('[data-modal-container]');
  private readonly modalI18n = this.element.dataset.i18n && JSON.parse(this.element.dataset.i18n);
  private readonly closeButton: HTMLButtonElement | null = this.getElement('[data-close-button]');
  private readonly mask: HTMLElement | null = this.getElement('[data-mask]');
  private app: App | null = null;
  private previouslyRenderedActions: Array<OVERLAY_ACTIONS> = [];
  private dataFragmentDisposables = new DisposableManager();
  private previousButtonsDisposables = new DisposableManager();
  private initialClassName = this.element.className;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O10ModalTransitionController(this);
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
    this.app?.overlay?.dispatchAction({ type: MODAL.CLOSE });
  };

  public handleAction = async (action: MODAL_ACTIONS) => {
    switch (action.type) {
      case MODAL.STANDARD_DYNAMIC: {
        this.previouslyRenderedActions.push(action);
        const { template, data, options } = action.payload;
        this.element.className = this.initialClassName;
        if (options?.classnames) {
          options.classnames.forEach((name) => this.element.classList.add(name));
        }

        const backButtonLabelInTemplateData = data.backButtonLabel;
        const backButtonLabelInI18n = this.modalI18n.common.back;
        const isViewportSmallerThanMedium =
          deviceStateTracker.currentDeviceState.state <= mq.deviceState.MEDIUM;
        const viewportAppropriateBackLabel = isViewportSmallerThanMedium
          ? backButtonLabelInTemplateData || backButtonLabelInI18n
          : backButtonLabelInI18n;

        const isPreviousModal = this.previouslyRenderedActions.length > 1;
        const backButtonLabel = isPreviousModal ? viewportAppropriateBackLabel : undefined;

        const markup = template({ ...data, backButtonLabel });

        await this.openDynamic(markup);
        break;
      }
      case MODAL.CLOSE: {
        await this.closeModal();

        break;
      }
    }
  };

  public async openDynamic(markup: string): Promise<void> {
    if (this.modalContainer == null) {
      throw new Error('this.modalContainer is undefined');
    }
    this.element.classList.add(StateClassNames.OPEN);

    this.modalContainer.innerHTML = markup;
    initComponents(this.modalContainer);

    this.scrollEnabled = false;

    if (this.modalContainer === null) throw new Error('The Modal container was not found');

    this.assignPreviousModalButtons();
    this.addListenersToElementsWithDataFragmentId();

    return this.transitionIn();
  }

  private addListenersToElementsWithDataFragmentId() {
    // locate and add listeners to elements with data fragment ids that should lead to nested modals
    const elementsWithDataFragmentId = this.getElements('[data-nested-modal-id]');
    this.dataFragmentDisposables.dispose();
    elementsWithDataFragmentId.forEach((element) => {
      const id = element.dataset.nestedModalId;
      const button = element.querySelector(`[data-component="${M02Button.displayName}"]`);

      if (button && id) {
        this.addDisposableEventListener(
          button,
          'click',
          () => this.requestDataFragment(id),
          this.dataFragmentDisposables,
        );
      }
    });
  }

  private async requestDataFragment(id: string) {
    try {
      const response = await get(id);
      const { type, payload } = (await response.json()) as BE_MODAL_ACTION_RESPONSE;

      const modalContentTemplate = await lazyModalContentTemplates[type]();

      const classnames = [];
      if (payload.theme === 'dark') {
        classnames.push(StateThemeClassNames.DARK);
      }
      if (payload.theme === 'navy') {
        classnames.push(StateThemeClassNames.NAVY);
      }
      if (payload.transparent) {
        classnames.push(StateClassNames.TRANSPARENT);
      }

      const action: OPEN_MODAL_STANDARD_DYNAMIC = {
        type: MODAL.STANDARD_DYNAMIC,
        payload: {
          template: modalContentTemplate.default,
          data: payload.content,
          options: {
            classnames,
          },
        },
      };

      this.app?.overlay?.dispatchAction(action);
    } catch (err) {
      console.log(err);
    }
  }

  public assignPreviousModalButtons() {
    this.previousButtonsDisposables.dispose();
    this.previousModalButtons = this.getElements('[data-back-button]');

    this.previousModalButtons.forEach(
      (button) =>
        this.addDisposableEventListener(button, 'click', () => {
          this.goToPreviousModal();
        }),
      this.previousButtonsDisposables,
    );
  }

  public goToPreviousModal() {
    this.modalContainer && cleanElement(this.modalContainer);
    const previousAction = this.previouslyRenderedActions.splice(-2)[0];

    previousAction && this.app?.overlay?.dispatchAction(previousAction);
  }

  public async closeModal(): Promise<void> {
    this.previouslyRenderedActions = [];
    this.element.classList.remove(StateClassNames.OPEN);
    this.scrollEnabled = true;

    await this.transitionOut();

    this.modalContainer && cleanElement(this.modalContainer);
    this.modalContainer?.scrollTo(0, 0);
  }

  private set scrollEnabled(isEnabled: boolean) {
    if (!this.app) throw new Error('The app component cannot be found');
    this.app.toggleScroll(isEnabled);
  }
}
