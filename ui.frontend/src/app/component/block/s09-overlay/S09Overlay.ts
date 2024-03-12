import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C78OverlayTransitionController from './S09OverlayTransitionController';
import { OVERLAY_ACTIONS } from './S09Overlay.types';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';

export default class S09Overlay extends AbstractTransitionComponent {
  public static readonly displayName: string = 's09-overlay';

  public readonly transitionController: C78OverlayTransitionController;
  private app: App | null = null;

  private actionInProgress = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C78OverlayTransitionController(this);
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  public dispatchAction = async (action: OVERLAY_ACTIONS) => {
    if (this.actionInProgress) {
      return;
    }

    this.actionInProgress = true;

    if (process.env.NODE_ENV === 'development') {
      this.debug(action);
    }

    const overlayEvent = new CustomEvent('overlayAction', {
      detail: action,
    });

    this.app?.element.dispatchEvent(overlayEvent);

    this.actionInProgress = false;
  };

  private debug(action: OVERLAY_ACTIONS) {
    console.log('ACTION: ', action.type);
    if ('payload' in action) {
      console.log('PAYLOAD: ', action.payload);
    }
  }
}
