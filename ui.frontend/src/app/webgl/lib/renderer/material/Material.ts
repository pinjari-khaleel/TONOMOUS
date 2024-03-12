import GL from '../base/GL';
import Shader from './Shader';
import Renderer from '../render/Renderer';
import Texture from '../texture/Texture';
import Color from 'mediamonks-webgl/renderer/math/Color';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
// import FloatUniform from './uniforms/FloatUniform';
// import Vector3Uniform from './uniforms/Vector3Uniform';
import Vector4 from '../math/Vector4';
import Matrix3x3 from 'mediamonks-webgl/renderer/math/Matrix3x3';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';
import Matrix2x2 from 'mediamonks-webgl/renderer/math/Matrix2x2';
import IWebGLDestructible from '../core/IWebGLDestructible';

// a material is not bound to a shader

export default class Material implements IWebGLDestructible {
  private static staticId: number = 0;

  public readonly id: number;
  public name: string;
  private _shaderDefines: { [k: string]: any } = {};

  public drawType: number = GL.TRIANGLES;

  // NOTE: Depth test needs to be true for depth write to work. If you want to write without reading, set depthTest
  // to true and depthFunc to GL.ALWAYS"
  public depthTest = true;
  public depthWrite = true;
  public alphaToCoverage = false;

  public depthFunc: number = GL.LESS;
  public blend: boolean = false;
  public blendEquation!: number;
  public sourceBlend!: number;
  public destinationBlend!: number;
  // do not reuse a shader between materials: this would mess up the state of the uniforms
  public shader: Shader;
  public culling: number = GL.BACK;
  public readonly renderer: Renderer;

  public blendFuncSeparate = false;
  public sourceBlendRGB: number = GL.ONE;
  public destinationBlendRGB: number = GL.ZERO;
  public sourceBlendAlpha: number = GL.ONE;
  public destinationBlendAlpha: number = GL.ZERO;

  constructor(renderer: Renderer, name: string, shader: Shader) {
    this.renderer = renderer;
    this.name = name;
    this.shader = shader;
    this.id = Material.staticId++;

    this.setDefaultBlending();
  }

  public setActive() {
    // even if there is no material switch for the renderer, a uniform might have been set on a different program
    this.renderer.renderState.setProgram(this.shader.program);

    this.shader.getTextureUniforms().forEach((uniform) => uniform.bind());

    if (this.renderer.renderState.material != this) {
      this.renderer.renderState.material = this;

      this.renderer.renderState.setAlphaToCoverage(this.alphaToCoverage);
      this.renderer.renderState.setDepthTest(this.depthTest);
      this.renderer.renderState.setDepthMask(this.depthWrite);
      this.renderer.renderState.setDepthFunc(this.depthFunc);
      this.renderer.renderState.setCulling(this.culling);
      this.renderer.renderState.setBlendEnabled(this.blend);

      if (this.blend) {
        this.renderer.renderState.setBlendEquation(this.blendEquation);
        if (this.blendFuncSeparate) {
          if (
            this.sourceBlendRGB === null ||
            this.destinationBlendRGB === null ||
            this.sourceBlendAlpha === null ||
            this.destinationBlendAlpha === null
          ) {
            throw new ReferenceError('expected blend properties to be set');
          }

          this.renderer.renderState.setBlendFuncSeparate(
            this.sourceBlendRGB,
            this.destinationBlendRGB,
            this.sourceBlendAlpha,
            this.destinationBlendAlpha,
          );
        } else {
          this.renderer.renderState.setBlendFunc(this.sourceBlend, this.destinationBlend);
        }
      }
    }
  }

  public setDefaultBlending() {
    this.depthTest = true;
    this.depthWrite = true;
    this.blend = false;
    this.blendEquation = GL.FUNC_ADD;
    this.sourceBlend = GL.ZERO;
    this.destinationBlend = GL.ONE;
  }

  // http://www.andersriggelsen.dk/glblendfunc.php
  public setAlphaBlending(): void {
    this.depthWrite = false;
    this.depthTest = true;
    this.blend = true;
    this.blendEquation = GL.FUNC_ADD;
    this.setBlendUnified(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
  }

  public setPreMultipliedAlphaBlending(): void {
    this.depthWrite = false;
    this.depthTest = true;
    this.blend = true;
    this.blendEquation = GL.FUNC_ADD;
    this.setBlendUnified(GL.ONE, GL.ONE_MINUS_SRC_ALPHA);
  }

  public setMaxBlending(): void {
    this.depthWrite = false;
    this.depthTest = false;
    this.blend = true;
    this.blendEquation = 0x8008; // requires enabling EXT_blend_minmax
    this.sourceBlend = GL.ONE;
    this.destinationBlend = GL.ONE;
    this.setBlendUnified(GL.ONE, GL.ONE);
  }

  public setAdditiveBlending(): void {
    this.depthWrite = false;
    this.depthTest = true;
    this.blend = true;
    this.blendEquation = GL.FUNC_ADD;
    this.setBlendUnified(GL.ONE, GL.ONE);
  }

  public setMultiplyBlending(): void {
    this.depthWrite = false;
    this.depthTest = true;
    this.blend = true;
    this.blendEquation = GL.FUNC_ADD;
    this.setBlendUnified(GL.ZERO, GL.SRC_COLOR);
  }

  public setSubtractiveBlending(): void {
    this.depthWrite = false;
    this.depthTest = false;
    this.blend = true;
    this.blendEquation = GL.FUNC_SUBTRACT;
    this.setBlendUnified(GL.ONE, GL.ONE_MINUS_SRC_ALPHA);
  }

  public setBlendUnified(source: number, dest: number): void {
    this.blendFuncSeparate = false;
    this.sourceBlend = source;
    this.destinationBlend = dest;
  }

  public setBlendSeparate(
    sourceRGB: number,
    destRGB: number,
    sourceAlpha: number,
    destAlpha: number,
  ): void {
    this.blendFuncSeparate = true;
    this.sourceBlendRGB = sourceRGB;
    this.sourceBlendAlpha = sourceAlpha;
    this.destinationBlendRGB = destRGB;
    this.destinationBlendAlpha = destAlpha;
  }

  public setCullingBackFace(): void {
    this.culling = GL.BACK;
  }

  public setCullingFrontFace(): void {
    this.culling = GL.FRONT;
  }

  public setCullingDisabled(): void {
    this.culling = GL.NONE;
  }

  public setDrawTypePoints(): void {
    this.drawType = GL.POINTS;
  }

  public setDrawTypeLines(): void {
    this.drawType = GL.LINES;
  }

  public setDrawTypeLineStrip(): void {
    this.drawType = GL.LINE_STRIP;
  }

  public setDrawTypeTriangles(): void {
    this.drawType = GL.TRIANGLES;
  }

  public setDrawTypeTriangleFan(): void {
    this.drawType = GL.TRIANGLE_FAN;
  }

  public setDrawTypeTriangleStrip(): void {
    this.drawType = GL.TRIANGLE_STRIP;
  }

  public setFloat(propertyName: string, value: number) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform1f(loc, value);
    }
  }

  public setInt(propertyName: string, value: number) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform1i(loc, value);
    }
  }

  public setFloats(
    propertyName: string,
    v0: number = 0,
    v1: number = 0,
    v2: number = 0,
    v3: number = 0,
  ) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform4f(loc, v0, v1, v2, v3);
    }
  }

  public setMatrix(propertyName: string, value: Matrix4x4) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniformMatrix4fv(loc, false, value.m);
    }
  }

  public setMatrix3x3(propertyName: string, value: Matrix3x3) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniformMatrix3fv(loc, false, value.m);
    }
  }

  public setMatrix2x2(propertyName: string, value: Matrix2x2) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniformMatrix2fv(loc, false, value.m);
    }
  }

  // this does not rely on getting a uniform name from the shader text
  public setMatrixArray(propertyName: string, value: Matrix4x4[]) {
    for (let i = 0; i < value.length; i++) {
      const name: string = propertyName + '[' + i + ']';
      this.setMatrix(name, value[i]);
    }
  }

  // value is a combined array of matrices
  public setMatrixArray2(propertyName: string, value: Matrix4x4) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniformMatrix4fv(loc, false, value.m);
    }
  }

  public setMatrixFloatArray(propertyName: string, value: Float32Array) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniformMatrix4fv(loc, false, value);
    }
  }

  // caches texture
  public setTexture(propertyName: string, texture: Texture) {
    if (!this.shader) {
      throw new ReferenceError('Material has no Shader');
    }
    const uniform = this.shader.getTextureUniformByName(propertyName);
    if (uniform) {
      uniform.set(texture);
    }
  }

  public unSetTexture(propertyName: string) {
    const uniform = this.shader.getTextureUniformByName(propertyName);
    if (uniform) {
      uniform.unSet();
    }
  }

  public setFloat32Array(propertyName: string, array: Float32Array) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform1fv(loc, array);
    }
  }

  public setInt32Array(propertyName: string, array: Int32Array) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform1iv(loc, array);
    }
  }

  public setColor(propertyName: string, color: Color) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform4f(loc, color.r, color.g, color.b, color.a);
    }
  }

  public setVector3(propertyName: string, value: Vector3) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform3f(loc, value.x, value.y, value.z);
    }
  }

  public setVector3Array(propertyName: string, array: Float32Array) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform3fv(loc, array);
    }
  }

  public setVector2(propertyName: string, value: Vector2) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform2f(loc, value.x, value.y);
    }
  }

  public setVector2Array(propertyName: string, array: Float32Array) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform2fv(loc, array);
    }
  }

  public setVector4(propertyName: string, value: Vector4) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform4f(loc, value.x, value.y, value.z, value.w);
    }
  }

  public setVector4Array(propertyName: string, array: Float32Array) {
    const loc = this.getUniformLocation(propertyName);
    if (loc) {
      this.renderer.renderState.setProgram(<WebGLProgram>this.shader.program);
      this.renderer.context.uniform4fv(loc, array);
    }
  }

  public getUniformLocation(propertyName: string): WebGLUniformLocation | null | false {
    // if(!this.shader.getUniformLocation(propertyName))console.warn('getUniformLocation: not found', this.name, propertyName);
    return this.shader.getUniformLocation(propertyName);
  }

  public hasUniform(name: string): boolean {
    return !!this.getUniformLocation(name);
  }

  public addShaderDefines(...defines: any[]) {
    for (let i = 0; i < defines.length; i++) {
      const k = defines[i] instanceof Array ? defines[i][0] : defines[i];
      const v = defines[i] instanceof Array ? defines[i][1] : 1;

      if (this._shaderDefines[k] == null) {
        this._shaderDefines[k] = v;
      }
    }
  }

  public getShaderDefines(): { [k: string]: any } {
    return this._shaderDefines;
  }

  public clearShaderDefines() {
    this._shaderDefines = [];
  }

  destruct() {
    this.shader.destruct();
  }
}
