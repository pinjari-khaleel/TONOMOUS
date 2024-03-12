import Renderer from './Renderer';
import Mesh from '../mesh/Mesh';
import Material from '../material/Material';
import GL from '../base/GL';
import Texture from 'mediamonks-webgl/renderer/texture/Texture';
import IWebGLDestructible from '../core/IWebGLDestructible';

export default class RenderState implements IWebGLDestructible {
  private renderer: Renderer;
  private program: WebGLProgram | null = null;

  public mesh: Mesh | null = null;
  public enabledAttribArrays: number[] = [];
  public material: Material | null = null;

  private depthMask: boolean = true;
  private depthTest: boolean = true;
  private alphaToCoverage: boolean = false;
  private depthFunc: number = -1;
  private culling: number = -1;
  private cullingEnabled: boolean = true;
  private blendEquation: number = -1;
  private blendEnabled: boolean = true;
  private sourceBlend: number = -1;
  private destinationBlend: number = -1;
  private textureSlots: (WebGLTexture | null)[] = [];
  private activeTextureSlot: number = -1;

  constructor(renderer: Renderer) {
    this.renderer = renderer;

    this.setBlendEnabled(!this.blendEnabled);
    this.setCullingEnabled(!this.cullingEnabled);
    this.setDepthMask(!this.depthMask);
    this.setDepthTest(!this.depthTest);
  }

  public bindTextureToSlot(texture: Texture, value: number = 0): void {
    if (this.textureSlots[value] != texture.textureGL) {
      this.activateSlot(value);
      this.renderer.context.bindTexture(texture.target, texture.textureGL);
      this.textureSlots[value] = texture.textureGL;
    }
  }

  public activateSlot(value: number = 0) {
    if (this.activeTextureSlot != value) {
      this.activeTextureSlot = value;
      this.renderer.context.activeTexture(GL.TEXTURE0 + value);
    }
  }

  public unBindTextureFromSlot(textureGL: WebGLTexture, value: number = 0): void {
    if (this.textureSlots[value] == textureGL) {
      this.activateSlot(value);
      this.renderer.context.bindTexture(GL.TEXTURE_2D, null);
      this.textureSlots[value] = null;
    }
  }

  public setProgram(program: WebGLProgram): boolean {
    if (program != this.program) {
      this.program = program;
      this.renderer.context.useProgram(this.program);
      return true;
    }
    return false;
  }

  public setDepthMask(value: boolean): void {
    if (value != this.depthMask) {
      this.renderer.context.depthMask(value);
      this.depthMask = value;
    }
  }

  public getDepthMask(): boolean {
    return this.depthMask;
  }

  public setAlphaToCoverage(value: boolean): void {
    if (value != this.alphaToCoverage) {
      value
        ? this.renderer.context.enable(GL.SAMPLE_ALPHA_TO_COVERAGE)
        : this.renderer.context.disable(GL.SAMPLE_ALPHA_TO_COVERAGE);
      this.alphaToCoverage = value;
    }
  }

  public setDepthTest(value: boolean): void {
    if (value != this.depthTest) {
      value
        ? this.renderer.context.enable(GL.DEPTH_TEST)
        : this.renderer.context.disable(GL.DEPTH_TEST);
      this.depthTest = value;
    }
  }

  public setDepthFunc(value: number): void {
    if (value != this.depthFunc) {
      this.renderer.context.depthFunc(value);
      this.depthFunc = value;
    }
  }

  public setCullingEnabled(value: boolean): void {
    if (value != this.cullingEnabled) {
      value
        ? this.renderer.context.enable(GL.CULL_FACE)
        : this.renderer.context.disable(GL.CULL_FACE);
      this.cullingEnabled = value;
    }
  }

  public setCulling(value: number): void {
    if (value != this.culling) {
      if (value == GL.NONE) {
        this.setCullingEnabled(false);
      } else {
        this.setCullingEnabled(true);
        this.renderer.context.cullFace(value);
      }
      this.culling = value;
    }
  }

  public setBlendEquation(value: number): void {
    if (value != this.blendEquation) {
      this.renderer.context.blendEquation(value);
      this.blendEquation = value;
    }
  }

  public setBlendEnabled(value: boolean): void {
    if (value != this.blendEnabled) {
      value ? this.renderer.context.enable(GL.BLEND) : this.renderer.context.disable(GL.BLEND);
      this.blendEnabled = value;
    }
  }

  public setBlendFunc(source: number, destination: number): void {
    if (source != this.sourceBlend || destination != this.destinationBlend) {
      this.renderer.context.blendFunc(source, destination);
      this.sourceBlend = source;
      this.destinationBlend = destination;
    }
  }

  public setBlendFuncSeparate(
    sourceRGB: number,
    destRGB: number,
    sourceAlpha: number,
    destAlpha: number,
  ): void {
    this.renderer.context.blendFuncSeparate(sourceRGB, destRGB, sourceAlpha, destAlpha);
    //reset for setBlendFunc
    this.sourceBlend = -1;
  }

  public destruct(): void {}
}
