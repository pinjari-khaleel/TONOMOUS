import ShaderAttribute from './ShaderAttribute';
import Renderer from '../render/Renderer';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import RequireContextIndex from 'mediamonks-webgl/utils/assets/RequireContextIndex';
import TextureUniform from './uniforms/TextureUniform';
import GL from '../base/GL';
import GL2 from '../base/GL2';
import IWebGLDestructible from '../core/IWebGLDestructible';

export default class Shader implements IWebGLDestructible {
  public static staticId: number = 0;

  public readonly id: number;
  public program!: WebGLProgram;
  public name: string = 'unnamed';

  public attributes: ShaderAttribute[] | undefined;
  public readonly renderer: Renderer;
  public shaderDefines: { [k: string]: any };

  private textureUniforms: TextureUniform[] | undefined = undefined;
  private uniformLocationsByName:
    | { [name: string]: WebGLUniformLocation | false }
    | undefined = undefined;

  private vShader!: WebGLShader;
  private fShader!: WebGLShader;

  private vShaderSource: string = '';
  private fShaderSource: string = '';
  private compileStatusChecked: boolean = false;

  public constructor(renderer: Renderer, shaderDefines: { [k: string]: any } = {}) {
    this.id = Shader.staticId++;
    this.renderer = renderer;
    this.shaderDefines = shaderDefines;
  }

  public load(shaderName: string, shaderIndex: RequireContextIndex, callback: () => any): void {
    Promise.all([
      shaderIndex.loadAssetByName(`${shaderName}.vs.glsl`),
      shaderIndex.loadAssetByName(`${shaderName}.fs.glsl`),
    ]).then((shaderAssets) => {
      this.loadIncludes(shaderAssets, shaderIndex, (textsWithIncludes: string[]) => {
        this.init(shaderName, textsWithIncludes[0], textsWithIncludes[1], callback);
      });
    });
  }

  private loadIncludes(
    texts: Array<string>,
    shaderIndex: RequireContextIndex,
    callback: (outputTexts: string[]) => any,
  ): void {
    const includePattern = /^#include\s+(\S+)/;
    const shaderIncludes: Array<[string, RegExpExecArray]> = [];

    for (let t = 0; t < texts.length; t++) {
      const lines = texts[t].split('\n');

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line = line.trim();
        let result;

        if ((result = includePattern.exec(line)) !== null) {
          shaderIncludes.push([<string>result[1], result]);
        }
      }
    }

    if (shaderIncludes.length) {
      const includesToLoad: string[] = [];
      for (let i = 0; i < shaderIncludes.length; i++) {
        includesToLoad[i] = shaderIncludes[i][0];
      }

      Promise.all(includesToLoad.map((include) => shaderIndex.loadAssetByPath(include))).then(
        (includes) => {
          for (let t = 0; t < texts.length; t++) {
            for (let i = 0; i < shaderIncludes.length; i++) {
              texts[t] = texts[t].replace(
                shaderIncludes[i][1][0],
                '\n\n///// Start ' +
                  includesToLoad[i] +
                  '\n\n' +
                  includes[i] +
                  '\n\n///// End ' +
                  includesToLoad[i] +
                  '\n\n',
              );
            }
          }
          this.loadIncludes(texts, shaderIndex, callback);
        },
      );
    } else {
      callback.call(this, texts);
    }
  }

  private static stripUniformDuplicates(text: string): string {
    let strippedText = '';
    const uniforms: { [name: string]: boolean } = {};

    const uniformPpattern = /^uniform\s+(\S*)\s+(\S*);/;

    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      line = line.trim();
      let result;

      if ((result = uniformPpattern.exec(line)) !== null) {
        const uniform = result[2];
        if (uniforms[uniform]) {
          line = '// ' + line;
        }
        uniforms[uniform] = true;
      }

      strippedText += line + '\n';
    }

    return strippedText;
  }

  public init(
    name: string,
    vsText: string,
    fsText: string,
    callback: (() => any) | null = null,
  ): Shader {
    this.name = name;

    if (this.shaderDefines) {
      let defines: string = '';
      let i = 0;
      for (let k in this.shaderDefines) {
        defines += '#define ' + k + ' ' + this.shaderDefines[k] + '\n';
        i++;
      }
      if (i > 0) {
        LogGL.log('adding defines: ', this.name, defines);
        vsText = defines + vsText;
        fsText = defines + fsText;
      }
    }

    vsText = Shader.stripUniformDuplicates(vsText);
    fsText = Shader.stripUniformDuplicates(fsText);

    // allow renderer to have to custom parsing logic unique to each type
    // of renderer
    this.vShaderSource = this.renderer.preprocessShaderString(vsText);
    this.fShaderSource = this.renderer.preprocessShaderString(fsText);

    const gl = this.renderer.context;
    this.vShader = Shader.compileShader(gl, this.vShaderSource, gl.VERTEX_SHADER);
    this.fShader = Shader.compileShader(gl, this.fShaderSource, gl.FRAGMENT_SHADER);

    this.program = Shader.LinkProgram(gl, this.vShader, this.fShader);

    if (callback) {
      callback.call(this);
    }
    return this;
  }

  private static compileShader(gl: WebGLRenderingContext, src: string, type: number): WebGLShader {
    const shader = <WebGLShader>gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  }

  private static LinkProgram(
    gl: WebGLRenderingContext,
    vs: WebGLShader,
    fs: WebGLShader,
  ): WebGLProgram {
    const program = <WebGLProgram>gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    return program;
  }

  private checkCompileStatus() {
    if (!this.compileStatusChecked) {
      this.compileStatusChecked = true;

      const gl = this.renderer.context;
      if (gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        return;
      } else {
        this.showErrorLog(gl.getShaderInfoLog(this.vShader), this.vShaderSource);
        this.showErrorLog(gl.getShaderInfoLog(this.fShader), this.fShaderSource);
        this.showErrorLog(gl.getProgramInfoLog(this.program), this.fShaderSource);

        throw new Error('unable to compile shader');
      }
    }
  }

  private showErrorLog(errors: any, src: string) {
    if (errors) {
      LogGL.error('compileShader: error: ' + this.name + ' \n' + errors);
      console.log('%c compileShader: ' + this.name, 'background:' + ' #fff0f0; color: red');
      console.log(errors);

      // get linenumbers
      const linenumberPattern = /ERROR: (\d+):(\d+):/;
      let lines = errors.split('\n');
      const errorlines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let result;
        if ((result = linenumberPattern.exec(line)) !== null) {
          errorlines[parseInt(result[2], 10) - 1] = line;
        }
      }
      // create error console log
      lines = src.split('\n');
      const errorlog = [];
      errorlog[0] = '';
      for (let i = 0; i < lines.length; i++) {
        errorlog[0] += '%c' + lines[i] + '\n';
        errorlog[i + 1] = errorlines[i]
          ? 'background: #fff0f0; color: red'
          : 'background: white; color: black';
        if (errorlines[i]) {
          errorlog[0] += ' --> ' + errorlines[i] + '\n';
        }
      }
      // @ts-ignore
      console.log.apply(console, errorlog);
      console.log('%c compileShader: ' + this.name, 'background: #fff0f0; color: red');
    }
  }

  public getUniformLocation(name: string): WebGLUniformLocation | false {
    if (!this.uniformLocationsByName) {
      this.getTextureUniforms();
    }
    let loc = (<{ [name: string]: WebGLUniformLocation | false }>this.uniformLocationsByName)[name];
    // this is used by uniform arrays: the uniform was not found in the shader text, but does exist after
    // compiling can be used for caching of all uniforms
    if (loc === undefined) {
      loc = this.renderer.context.getUniformLocation(this.program, name) || false;
      (<{ [name: string]: WebGLUniformLocation | false }>this.uniformLocationsByName)[name] = loc;
    }
    return loc;
  }

  public getTextureUniforms(): TextureUniform[] {
    if (!this.textureUniforms) {
      this.checkCompileStatus();

      const gl = this.renderer.context;
      const activeUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);

      this.textureUniforms = [];
      this.uniformLocationsByName = {};

      let index = 0;

      for (let i = 0; i < activeUniforms; i++) {
        const uniform = <WebGLActiveInfo>gl.getActiveUniform(this.program, i);
        const loc = <WebGLUniformLocation>gl.getUniformLocation(this.program, uniform.name);

        this.uniformLocationsByName[uniform.name] = loc;
        if (
          uniform.type === GL.SAMPLER_2D ||
          uniform.type === GL.SAMPLER_CUBE ||
          uniform.type === GL2.SAMPLER_3D
        ) {
          this.textureUniforms.push(new TextureUniform(this, uniform.name, loc, index));
          index++;
        }
      }
    }
    return this.textureUniforms;
  }

  public getAttributes(): ShaderAttribute[] {
    if (!this.attributes) {
      this.checkCompileStatus();

      const gl = this.renderer.context;
      const activeAttributes = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
      this.attributes = [];

      for (let i = 0; i < activeAttributes; i++) {
        const attribute = <WebGLActiveInfo>gl.getActiveAttrib(this.program, i);
        const loc: number = gl.getAttribLocation(this.program, attribute.name);
        const stride: number = Shader.getStride(attribute.type);
        this.attributes.push(new ShaderAttribute(attribute.name, stride, loc));
      }
    }
    return this.attributes;
  }

  public getAttributeByName(name: string): ShaderAttribute | undefined {
    const attributes = this.attributes || this.getAttributes();

    return attributes.find((a) => a.name === name);
  }

  public getTextureUniformByName(name: string): TextureUniform | undefined {
    const uniforms = this.textureUniforms || this.getTextureUniforms();

    return uniforms.find((u) => u.name === name);
  }

  private static getStride(index: number): number {
    switch (index) {
      case GL.FLOAT:
        return 1;
      case GL.FLOAT_VEC2:
        return 2;
      case GL.FLOAT_VEC3:
        return 3;
      case GL.FLOAT_VEC4:
        return 4;
      case GL.FLOAT_MAT2:
        return 4;
      case GL.FLOAT_MAT3:
        return 9;
      case GL.FLOAT_MAT4:
        return 16;
      case GL.INT:
        return 1;
      default:
        LogGL.error('attribute type not handled: ' + index);
        return -1;
    }
  }

  destruct() {
    const gl = this.renderer.context;
    gl.deleteShader(this.vShader);
    gl.deleteShader(this.fShader);
    gl.deleteProgram(this.program);
  }
}
