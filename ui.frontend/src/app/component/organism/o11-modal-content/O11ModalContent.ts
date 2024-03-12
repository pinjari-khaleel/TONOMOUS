import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class O11ModalContent extends AbstractComponent {
  public static readonly displayName: string = 'o11-modal-content';

  constructor(el: HTMLElement) {
    super(el);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
