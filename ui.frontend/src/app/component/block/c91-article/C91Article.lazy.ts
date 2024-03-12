import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C91ArticleTransitionController from './C91ArticleTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { openSharePopup } from '../../../util/OpenSharePopup';

import './c91-article.scss';

export default class C91Article extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c91-article';

  public readonly transitionController: C91ArticleTransitionController;
  private readonly shareButton = this.getElement<HTMLButtonElement>('[data-share-button]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C91ArticleTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);

    if (this.shareButton == null) {
      throw new Error('this.shareButton is undefined');
    }

    this.addDisposableEventListener(this.shareButton, 'click', () => {
      openSharePopup(this.shareButton);
    });
  }
}
