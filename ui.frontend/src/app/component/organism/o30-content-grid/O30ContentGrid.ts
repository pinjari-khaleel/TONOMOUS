import AbstractComponent from 'app/component/AbstractComponent';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';

export default class O30ContentGrid extends AbstractComponent {
  public static readonly displayName: string = 'o30-content-grid';

  private playButtons = this.getElements('[data-play-button]');
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted() {
    this.app = await getAppComponent();
  }
}
