import Material from 'mediamonks-webgl/renderer/material/Material';
import ParamBase, { ParamCallback } from './ParamBase';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

export default class TextParam extends ParamBase {
  constructor(
    parent: ParamGroup,
    name: string,
    value: string,
    materials: Material[] | null = null,
    callback: ParamCallback<string> | null = null,
  ) {
    super(parent, name, materials, callback);

    this.setValue(value, false, false);
  }
}
