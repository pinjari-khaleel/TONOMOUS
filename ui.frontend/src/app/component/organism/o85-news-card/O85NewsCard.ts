import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import O85NewsCardTransitionController from './O85NewsCardTransitionController';

export default class O85NewsCard extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o85-news-card';
  public readonly transitionController: O85NewsCardTransitionController;

  private app: App | undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O85NewsCardTransitionController(this);
    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private addEventListeners() {
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  private onMouseEnter() {
    this.app?.transformCursor(true, 'arrow-right', 'outlinedCursorGreen');
  }

  private onMouseLeave() {
    this.app?.transformCursor(false);
  }
}
