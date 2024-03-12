import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C94PageNotFoundTransitionController from './C94PageNotFoundTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { getWebglApplication } from '../../../util/getWebglApplication';
import WebGLApplication from '../../../webgl/WebGLApplication';
import Color from 'mediamonks-webgl/renderer/math/Color';

import './c94-page-not-found.scss';

export default class C94PageNotFound extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c94-page-not-found';
  private webglApp!: WebGLApplication;
  public gradientColors: Array<string> = JSON.parse(this.element.dataset.gradientColors as string);
  public webglAsset = <string>this.element.dataset.asset;
  public readonly transitionController: C94PageNotFoundTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C94PageNotFoundTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.webglApp = await getWebglApplication();

    if (!this.webglApp || !this.gradientColors) return;
    this.webglApp.transitionTo(
      [
        new Color().setHex(this.gradientColors[0]),
        new Color().setHex(this.gradientColors[1]),
        new Color().setHex(this.gradientColors[2]),
      ],
      this.webglAsset,
      0.8,
      () => {},
    );
  }
}
