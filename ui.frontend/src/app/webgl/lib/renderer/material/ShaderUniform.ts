import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Matrix2x2 from 'mediamonks-webgl/renderer/math/Matrix2x2';
import Texture from 'mediamonks-webgl/renderer/texture/Texture';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';
import Matrix3x3 from 'mediamonks-webgl/renderer/math/Matrix3x3';
import Vector4 from 'mediamonks-webgl/renderer/math/Vector4';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import GL from 'mediamonks-webgl/renderer/base/GL';
import GL2 from 'mediamonks-webgl/renderer/base/GL2';
import Shader from 'mediamonks-webgl/renderer/material/Shader';

export default class ShaderUniform {
  public name: string;
  public location: WebGLUniformLocation;
  public samplerIndex: number; // used for textures
  public info: WebGLActiveInfo;
  public shader: Shader;
  public isTexture: boolean = false;

  private _setUniform: ((v: any) => void) | null = null;

  constructor(
    shader: Shader,
    location: WebGLUniformLocation,
    name: string,
    info: WebGLActiveInfo,
    samplerIndex: number = 0,
  ) {
    this.location = location;
    this.name = name;
    this.info = info;
    this.samplerIndex = samplerIndex;
    this.shader = shader;

    if (
      info.type === GL.SAMPLER_2D ||
      info.type === GL.SAMPLER_CUBE ||
      info.type === GL2.SAMPLER_3D
    ) {
      this.isTexture = true;
      this.shader.renderer.renderState.setProgram(shader.program);
      this.shader.renderer.context.uniform1i(this.location, samplerIndex);
    }
  }

  public setUniform<
    T =
      | boolean
      | number
      | Vector2
      | Vector3
      | Vector4
      | Matrix2x2
      | Matrix3x3
      | Matrix4x4
      | Float32Array
      | Texture
  >(value: T): void {
    // assume program is already active
    this.shader.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
    this._setUniform = <(v: any) => void>(this._setUniform || this.getSetUniform(value));
    this._setUniform(value);
  }

  private getSetUniform<
    T =
      | boolean
      | number
      | Vector2
      | Vector3
      | Vector4
      | Matrix2x2
      | Matrix3x3
      | Matrix4x4
      | Float32Array
      | Texture
  >(value: T) {
    const context = this.shader.renderer.context;
    switch (this.info.type) {
      case GL.BOOL:
        if (typeof value === 'number') {
          return (value: number) => context.uniform1f(this.location, value);
        } else if (typeof value === 'boolean') {
          return (value: number) => context.uniform1f(this.location, value);
        }
        break;
      case GL.INT:
        if (value instanceof Int32Array) {
          // array
          return (value: Int32Array) => context.uniform1iv(this.location, value);
        } else if (typeof value === 'number') {
          return (value: number) => context.uniform1i(this.location, value);
        } else if (typeof value === 'boolean') {
          return (value: boolean) => context.uniform1i(this.location, value ? 1 : 0);
        }
        break;
      case GL.FLOAT:
        if (value instanceof Float32Array) {
          // array
          return (value: Float32Array) => context.uniform1fv(this.location, value);
        } else if (typeof value === 'number') {
          return (value: number) => context.uniform1f(this.location, value);
        } else if (typeof value === 'boolean') {
          return (value: boolean) => context.uniform1f(this.location, value ? 1 : 0);
        }
        break;
      case GL.FLOAT_VEC2:
        if (value instanceof Float32Array) {
          // array
          return (value: Float32Array) => context.uniform2fv(this.location, value);
        } else if (value instanceof Vector2) {
          return (value: Vector2) => context.uniform2f(this.location, value.x, value.y);
        }
        break;
      case GL.FLOAT_VEC3:
        if (value instanceof Float32Array) {
          // array
          return (value: Float32Array) => context.uniform3fv(this.location, value);
        } else if (value instanceof Vector3) {
          return (value: Vector3) => context.uniform3f(this.location, value.x, value.y, value.z);
        }
        break;
      case GL.FLOAT_VEC4:
        if (value instanceof Float32Array) {
          // array
          return (value: Float32Array) => context.uniform4fv(this.location, value);
        } else if (value instanceof Vector4) {
          return (value: Vector4) =>
            context.uniform4f(this.location, value.x, value.y, value.z, value.w);
        }
        break;
      case GL.FLOAT_MAT2:
        if (value instanceof Float32Array) {
          // array
          return (value: Float32Array) => context.uniformMatrix2fv(this.location, false, value);
        } else if (value instanceof Matrix2x2) {
          return (value: Matrix2x2) => context.uniformMatrix2fv(this.location, false, value.m);
        }
        break;
      case GL.FLOAT_MAT3:
        if (value instanceof Float32Array) {
          // array
          return (value: Float32Array) => context.uniformMatrix3fv(this.location, false, value);
        } else if (value instanceof Matrix3x3) {
          return (value: Matrix3x3) => context.uniformMatrix3fv(this.location, false, value.m);
        }
        break;
      case GL.FLOAT_MAT4:
        if (value instanceof Float32Array) {
          // array
          return (value: Float32Array) => context.uniformMatrix4fv(this.location, false, value);
        } else if (value instanceof Matrix4x4) {
          return (value: Matrix4x4) => context.uniformMatrix4fv(this.location, false, value.m);
        }
        break;
      case GL.SAMPLER_2D:
      case GL.SAMPLER_CUBE:
      case GL2.SAMPLER_3D:
      default:
        return (value: T) => value;
        break;
    }
  }
}
