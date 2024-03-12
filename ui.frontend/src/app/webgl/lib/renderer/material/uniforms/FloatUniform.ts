import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Material from '../Material';
import IWebGLDestructible from '../../core/IWebGLDestructible';

export default class FloatUniform implements IWebGLDestructible {
  private _loc: WebGLUniformLocation;
  private _value!: number;
  private _renderer: Renderer;
  private _program: WebGLProgram;

  constructor(material: Material, name: string, value: number = 0) {
    this._loc = <WebGLUniformLocation>material.getUniformLocation(name);
    if (!this._loc) {
      console.warn('FloatUniform: uniform does not exist on shader: ', material.name, name);
    }

    if (!material.shader.program) {
      throw new ReferenceError(
        'Cannot construct FloatUniform from material: material shader is not yet initialized.',
      );
    }

    this._renderer = material.renderer;
    this._program = material.shader.program;

    this.value = value;
  }

  public set value(value: number) {
    if (value != this._value) {
      this._value = value;
      if (this._loc) {
        this._renderer.renderState.setProgram(this._program);
        this._renderer.context.uniform1f(this._loc, this._value);
      }
    }
  }

  public get value(): number {
    return this._value;
  }

  destruct() {}
}
