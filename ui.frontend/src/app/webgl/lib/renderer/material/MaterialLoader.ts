import Material from './Material';
import IWebGLPreloadable from 'mediamonks-webgl/renderer/core/IWebGLPreloadable';
import Renderer from '../render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import RequireContextIndex from 'mediamonks-webgl/utils/assets/RequireContextIndex';
import Shader from './Shader';

export default class MaterialLoader extends Material implements IWebGLPreloadable {
  private shaderIndex: RequireContextIndex;
  private shaderName: string;

  constructor(renderer: Renderer, preloader: WebGLPreLoader, name: string) {
    super(renderer, name, new Shader(renderer));

    this.shaderIndex = renderer.shaderIndex;
    this.shaderName = name;

    preloader.add(this);
  }

  public load(callback: () => void): void {
    this.shader.shaderDefines = this.getShaderDefines();

    this.shader.load(this.shaderName, this.shaderIndex, () => {
      callback.call(this);
    });
  }
}
