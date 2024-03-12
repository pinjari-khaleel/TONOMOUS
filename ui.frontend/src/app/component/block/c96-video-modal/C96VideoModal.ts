import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C96VideoModalTransitionController from './C96VideoModalTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import { VIDEO } from '../../../util/overlayActionTypes';
import { O01VideoProps } from 'app/component/organism/o01-video/O01Video.types';

import './c96-video-modal.scss';

const lazyO01Template = () =>
  import('../../organism/o01-video/o01-video.hbs?include') as LoadTemplateImport<O01VideoProps>;

export default class C96VideoModal extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c96-video-modal';
  private app: App | null = null;
  private readonly mediaButton = this.getElement('[data-media-button]') as HTMLElement;

  public readonly transitionController: C96VideoModalTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C96VideoModalTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.addEventListeners();
    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(this.mediaButton, 'click', () => {
      this.onCardItemClick();
    });
  }

  private async onCardItemClick(): Promise<void> {
    const data =
      this.mediaButton.dataset.video && JSON.parse(<string>this.mediaButton.dataset.video);

    const template = await lazyO01Template();

    this.app &&
      data &&
      this.app.overlay?.dispatchAction({
        type: VIDEO.STANDARD_DYNAMIC,
        payload: {
          template: template.default,
          data,
        },
      });
  }
}
