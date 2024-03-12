import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C37LegalContentTransitionController from './C37LegalContentTransitionController';
import WebGLApplication from '../../../webgl/WebGLApplication';
import { getWebglApplication } from '../../../util/getWebglApplication';
import Color from 'mediamonks-webgl/renderer/math/Color';
import S11TonomusNavigation from '../s11-tonomus-navigation/S11TonomusNavigation';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getComponentForElement } from 'muban-core';

import './c37-legal-content.scss';

export default class C37LegalContent extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c37-legal-content';
  private webglApp?: WebGLApplication;
  public gradientColors: Array<string> =
    this.element.dataset.gradientColors && JSON.parse(this.element.dataset.gradientColors);
  public webglAsset = <string>this.element.dataset.asset;
  public readonly transitionController: C37LegalContentTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C37LegalContentTransitionController(this);
  }

  private get tonomusNavigation() {
    const element = this.getElement(
      `[data-component="${S11TonomusNavigation.displayName}"]`,
      document.body,
    );
    if (!element) return null;
    return getComponentForElement<S11TonomusNavigation>(element);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.webglApp = await getWebglApplication();

    if (this.webglApp && this.gradientColors) {
      if (this.tonomusNavigation) {
        this.tonomusNavigation.forceScrollState = true;
        this.tonomusNavigation.element.classList.add(StateClassNames.SCROLLED);
      }

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
}
