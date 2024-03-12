import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class O40LightboxItem extends AbstractComponent {
  public static readonly displayName: string = 'o40-lightbox-item';

  constructor(el: HTMLElement) {
    super(el);
  }
}
