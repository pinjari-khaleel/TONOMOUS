import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C30DownloadsTransitionController from './C30DownloadsTransitionController';

import './c30-downloads.scss';

export default class C30Downloads extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c30-downloads';

  public readonly transitionController: C30DownloadsTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C30DownloadsTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
