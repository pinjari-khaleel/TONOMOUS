import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C88KeyCtaListTransitionController from './C88KeyCtaListTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c88-key-cta-list.scss';

export default class C88KeyCtaList extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c88-key-cta-list';

  public readonly transitionController: C88KeyCtaListTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C88KeyCtaListTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
