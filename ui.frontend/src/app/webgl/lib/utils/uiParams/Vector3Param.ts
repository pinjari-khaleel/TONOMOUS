import Material from 'mediamonks-webgl/renderer/material/Material';
import Vector3 from '../../renderer/math/Vector3';
import FloatParam from './FloatParam';
import ParamGroup from './ParamGroup';

export default class Vector3Param extends ParamGroup {
  private _value: Vector3;
  private _x: FloatParam;
  private _y: FloatParam;
  private _z: FloatParam;
  private _shaderParam: string;

  constructor(
    name: string,
    value: Vector3,
    min: Vector3,
    max: Vector3,
    materials: Material[] | null = null,
    shaderParam: string = 'unnamed',
    callback: (value: Vector3) => void,
  ) {
    super();
    this.init(name, materials);

    this._value = value;
    this._shaderParam = shaderParam;

    this._x = this.addShaderParamFloat('_X', value.x, min.x, max.x, (value: number) => {
      this._value.x = value;
      this.setShaderValue();
      callback(this._value);
    });
    this._y = this.addShaderParamFloat('_Y', value.y, min.y, max.y, (value: number) => {
      this._value.y = value;
      this.setShaderValue();
      callback(this._value);
    });
    this._z = this.addShaderParamFloat('_Z', value.z, min.z, max.z, (value: number) => {
      this._value.z = value;
      this.setShaderValue();
      callback(this._value);
    });

    this.setShaderValue();
  }

  private setShaderValue(): void {
    if (!this.materials) {
      throw new ReferenceError('Cannot set shader value: ParamGroup not initialized');
    }
    for (var i = 0; i < this.materials.length; i++) {
      this.materials[i].setVector3(this._shaderParam, this._value);
    }
  }

  public getValue(): Vector3 {
    return this._value;
  }

  public setValue(value: Vector3): void {
    this._value = value;
    this._x.setValue(value.x);
    this._y.setValue(value.y);
    this._z.setValue(value.z);
  }
}
