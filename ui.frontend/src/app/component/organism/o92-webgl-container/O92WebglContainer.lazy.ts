import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O92WebglContainerTransitionController from './O92WebglContainerTransitionController';
import WebGLApplication from '../../../webgl/WebGLApplication';
import { setAsInitialised } from '../../../util/setAsInitialised';

import './o92-webgl-container.scss';

export default class O92WebglContainerLazy extends AbstractTransitionComponent {
  public static displayName: string = 'o92-webgl-container';
  public transitionController: O92WebglContainerTransitionController;
  public webglApp: WebGLApplication;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new O92WebglContainerTransitionController(this);
    this.webglApp = new WebGLApplication();
    this.initCanvas();
    setAsInitialised(this.element);
  }

  /**
   * @public
   * @method initCanvas
   */
  public initCanvas(): void {
    this.webglApp.init(this.element, this.element.dataset.webglTest !== undefined);
    this.webglApp.load(
      () => {},
      () => {},
    );
  }

  public dispose() {
    super.dispose();
  }
}
