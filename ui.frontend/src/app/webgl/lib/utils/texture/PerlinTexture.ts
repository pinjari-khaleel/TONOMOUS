import WebGLPreLoader from '../../renderer/core/WebGLPreLoader';
import Renderer from '../../renderer/render/Renderer';
import RenderTexture from '../../renderer/texture/RenderTexture';
import TextureFormat from '../../renderer/texture/TextureFormat';
import VS from './shaders/tilingPerlin/tilingPerlin.vs.glsl';
import FS from './shaders/tilingPerlin/tilingPerlin.fs.glsl';
import Material from 'mediamonks-webgl/renderer/material/Material';
import Shader from 'mediamonks-webgl/renderer/material/Shader';

export default class PerlinTexture extends RenderTexture {
  private material: Material;

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    width: number = 1,
    height: number = 1,
    type: string = TextureFormat.RGB_UNSIGNED_BYTE,
    octaves: number = 7,
  ) {
    super(renderer, width, height, type, false, true, false);

    const shader = new Shader(renderer, { OCTAVES: octaves });
    shader.init('tilingPerlin', VS, FS);
    this.material = new Material(renderer, 'tilingPerlin', shader);
  }

  public generate(frequency: number = 1, falloff = 0.5) {
    // 1 would be a good value. Keep at 1 for tiling variant
    this.material.setFloat('_Falloff', falloff);
    this.material.setFloat('_Frequency', frequency);
    this.material.setFloat('_Seed', Math.random());

    this.material.renderer.blit(null, this, this.material);
  }
}
