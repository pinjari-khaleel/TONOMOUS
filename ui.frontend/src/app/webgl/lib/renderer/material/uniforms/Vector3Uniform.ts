import Vector3 from '../../math/Vector3';
import Material from '../Material';
import Renderer from '../../render/Renderer';

export default class Vector3Uniform {
  private _loc: WebGLUniformLocation;
  private _value = new Vector3();
  private _renderer: Renderer;
  private _program: WebGLProgram;

  constructor(material: Material, name: string, value: Vector3 = new Vector3()) {
    this._loc = <WebGLUniformLocation>material.getUniformLocation(name);
    if (!this._loc) {
      console.warn('FloatUniform: uniform does not exist on shader: ', name);
    }

    if (!material.shader.program) {
      throw new ReferenceError(
        'Cannot construct Vector3Uniform from material: material shader is not yet initialized.',
      );
    }

    this._renderer = material.renderer;
    this._program = material.shader.program;

    this.set(value);
  }

  public set(value: Vector3) {
    if (value.x != this._value.x || value.y != this._value.y || value.z != this._value.z) {
      this._value.copy(value);
      this._renderer.renderState.setProgram(this._program);
      this._renderer.context.uniform3f(this._loc, this._value.x, this._value.y, this._value.z);
    }
  }

  public getValue(): Vector3 {
    return this._value;
  }
}
