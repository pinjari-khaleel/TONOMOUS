import Material from 'mediamonks-webgl/renderer/material/Material';
import FloatUniform from 'mediamonks-webgl/renderer/material/uniforms/FloatUniform';
import Utils from '../../renderer/core/Utils';
import ParamBase, { ParamCallback } from './ParamBase';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

export default class FloatParam extends ParamBase {
  public min: number;
  public max: number;
  private uniforms: FloatUniform[] = [];

  constructor(
    parent: ParamGroup,
    name: string,
    value: number,
    min: number = 0,
    max: number = 1,
    materials: Material[] = [],
    callback: ParamCallback<number> | null = null,
  ) {
    super(parent, name, materials, callback);

    for (const m of this._materials) {
      this.uniforms.push(new FloatUniform(m, name, value));
    }

    this.min = min;
    this.max = max;
    if (this.max < value) {
      this.max = value * 2;
    }
    if (this.min > value) {
      this.min = value - 1;
    }
    this.setValue(value, false, false);
  }

  public setValue(value: any, fromUI: boolean = false, callCallback: boolean = true): void {
    value = Utils.clamp(value, this.min, this.max);
    super.setValue(value, fromUI, callCallback);
  }

  public setShaderUniform(value: number): void {
    for (const uniform of this.uniforms) {
      uniform.value = value;
    }
  }

  public destruct() {
    if (this.uniforms) {
      for (const floatUniform of this.uniforms) {
        floatUniform.destruct();
      }
      this.uniforms = [];
    }
    super.destruct();
  }
}
