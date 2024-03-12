import ParamBase, { ParamCallback } from './ParamBase';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

export default class ActionParam extends ParamBase {
  constructor(parent: ParamGroup, name: string, callback: ParamCallback | null = null) {
    super(parent, name, null, callback);
  }

  public get value(): any {
    return this._callback;
  }
}
