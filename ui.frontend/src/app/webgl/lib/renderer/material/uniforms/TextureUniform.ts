import Texture from 'mediamonks-webgl/renderer/texture/Texture';
import Shader from '../Shader';

export default class TextureUniform {
  public name: string;
  private texture: Texture | null | null = null;
  private samplerIndex: number;

  constructor(shader: Shader, name: string, loc: WebGLUniformLocation, samplerIndex: number) {
    this.name = name;
    this.samplerIndex = samplerIndex;

    if (!shader.program) {
      throw new ReferenceError(
        'Cannot construct TextureUniform from shader: shader is not yet initialized.',
      );
    }

    shader.renderer.renderState.setProgram(shader.program);
    shader.renderer.context.uniform1i(loc, samplerIndex);
  }

  public set(texture: Texture) {
    this.texture = texture;
  }

  public unSet() {
    if (this.texture) {
      this.texture.renderer.renderState.unBindTextureFromSlot(
        this.texture.textureGL,
        this.samplerIndex,
      );
    }
  }

  public bind(): void {
    //make sure the texture is bound to the slot which is sampled from
    if (this.texture) {
      this.texture.bindToSlot(this.samplerIndex);
    }
  }
}
