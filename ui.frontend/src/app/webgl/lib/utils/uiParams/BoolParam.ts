import Material from 'mediamonks-webgl/renderer/material/Material';
import ParamBase, { ParamCallback } from './ParamBase';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

export default class BoolParam extends ParamBase {
  constructor(
    parent: ParamGroup,
    name: string,
    value: boolean,
    materials: Material[] | null = null,
    callback: ParamCallback<boolean> | null = null,
  ) {
    super(parent, name, materials, callback);

    this.setValue(value, false, false);
  }

  public setShaderUniform(value: any): void {
    for (let i = 0; i < this._materials.length; i++) {
      this._materials[i].setFloat(this.name, value === true ? 1 : 0);
    }
  }
}
