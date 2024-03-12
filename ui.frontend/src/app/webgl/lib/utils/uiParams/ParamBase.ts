import Material from 'mediamonks-webgl/renderer/material/Material';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';

export type ParamCallback<T = any> = (value: T) => void;

export default class ParamBase implements IWebGLDestructible {
  public name: string;
  public id: number;
  public parent: ParamGroup; //needed for preset manager

  public _materials: Material[];
  public exposed: boolean = false;
  private _value: any;
  protected _callback: ParamCallback | null;
  protected _updateUIcallback: ParamCallback | undefined;

  private static _id: number = 0;

  constructor(
    parent: ParamGroup,
    name: string,
    materials: Material[] | null = null,
    callback: ParamCallback | null = null,
  ) {
    this.name = name;
    //this.id = 'param'+ParamBase._id++;
    this.id = ParamBase._id++;
    this.parent = parent;
    this._callback = callback;

    this._materials = materials ? materials : [];
  }

  public expose(): void {
    this.exposed = true;
  }

  // override
  public get value(): any {
    return this._value;
  }

  public setUpdateUICallback(callback: (value: any) => void) {
    this._updateUIcallback = callback;
  }

  public setChangeCallback(callback: (value: any) => void) {
    this._callback = callback;
  }

  public setValue(value: any, fromUI: boolean = false, callCallback: boolean = true): void {
    if (value !== this._value) {
      this._value = value;

      this.setShaderUniform(value);

      if (this._callback && callCallback) {
        this._callback(this._value);
      }

      if (!fromUI && this._updateUIcallback) {
        this._updateUIcallback.call(this, this.value);
      }
    }
  }

  public setFromUI(value: any): void {
    // console.log ("setFromUI:",  this.name, value);
    this.setValue(value, true);
  }

  public setShaderUniform(value: any): void {}

  public destruct(): void {}
}
