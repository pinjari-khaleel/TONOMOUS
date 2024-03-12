import ParamBase from 'mediamonks-webgl/utils/uiParams/ParamBase';
import FloatParam from 'mediamonks-webgl/utils/uiParams/FloatParam';
import IntParam from 'mediamonks-webgl/utils/uiParams/IntParam';
import BoolParam from 'mediamonks-webgl/utils/uiParams/BoolParam';
import ColorParam from 'mediamonks-webgl/utils/uiParams/ColorParam';
import Time from 'mediamonks-webgl/renderer/core/Time';
import Ease01 from 'mediamonks-webgl/utils/math/Ease01';
import Tween from 'mediamonks-webgl/utils/animation/Tween';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';

export default class ParameterAnimator implements IWebGLDestructible {
  private _paramsByName: { [name: string]: ParamBase } = {};
  private _transitions: Tween[] = [];

  constructor(params: ParamBase[]) {
    let filteredParams = this.filterParams(params);

    for (let param of filteredParams) {
      if (this._paramsByName[param.name])
        console.warn('ParameterAnimator: duplicate parameter name', param.name);
      this._paramsByName[param.name] = param;
    }
  }

  public valueTo(
    paramName: string,
    value: any,
    duration: number,
    completeCallback: (() => void) | undefined,
    easing: (t: number) => number = (t) => Ease01.smoothstep(t),
  ) {
    const param = this._paramsByName[paramName];
    if (param) {
      this._transitions.push(
        new Tween(param.value).to(
          value,
          duration,
          (v) => {
            param.setValue(v);
          },
          completeCallback,
          easing,
        ),
      );
    } else {
      console.warn('ParameterAnimator: valueTo : parameter not found: ', paramName);
    }
  }

  public update() {
    if (this._transitions.length === 0) {
      return;
    }

    for (let transition of this._transitions) {
      transition.update(Time.instance.deltaTime);
    }
    this._transitions = this._transitions.filter((transition) => !transition.completed);
  }

  private filterParams(params: ParamBase[]): ParamBase[] {
    let filtered: ParamBase[] = [];
    for (let param of params) {
      if (param instanceof FloatParam) {
        filtered.push(param);
      } else if (param instanceof IntParam) {
        filtered.push(param);
      } else if (param instanceof BoolParam) {
        filtered.push(param);
      } else if (param instanceof ColorParam) {
        filtered.push(param);
      } else {
        //console.log('filtered',param );
      }
    }

    return filtered;
  }

  public destruct(): void {}
}
