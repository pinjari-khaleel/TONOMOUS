import Vector3 from '../../renderer/math/Vector3';
import Material from '../../renderer/material/Material';
import Vector3Uniform from '../../renderer/material/uniforms/Vector3Uniform';
import ParamBase from './ParamBase';
import ParamGroup from 'mediamonks-webgl/utils/uiParams/ParamGroup';

export default class ColorParam extends ParamBase {
  private uniforms: Vector3Uniform[] = [];
  private color: Vector3 = new Vector3();

  constructor(
    parent: ParamGroup,
    name: string,
    value: Vector3,
    materials: Material[] = [],
    callback?: (value: number[]) => void,
  ) {
    super(parent, name, materials, callback);

    for (const m of this._materials) {
      this.uniforms.push(new Vector3Uniform(m, name, this.color));
    }

    this.setValue([value.x * 255, value.y * 255, value.z * 255]);
  }

  public getValueVector3(): Vector3 {
    return this.color;
  }

  private convertColorToArray(hex: any) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : hex;
  }

  //can be set from ui: then it is a number array
  public setValue(value: Vector3 | number[] | Float32Array, fromUI: boolean = false): void {
    if (value instanceof Vector3) {
      this.color.copy(<Vector3>value);
    } else {
      value = <number[] | Float32Array>this.convertColorToArray(value);
      this.color.setValues(value[0] / 255, value[1] / 255, value[2] / 255);
    }
    // console.log('setValue',value,  this._color.v);
    super.setValue([this.color.x * 255, this.color.y * 255, this.color.z * 255], fromUI);
  }

  public setShaderUniform(value: Float32Array): void {
    for (const uniform of this.uniforms) {
      uniform.set(this.color);
    }
  }
}
