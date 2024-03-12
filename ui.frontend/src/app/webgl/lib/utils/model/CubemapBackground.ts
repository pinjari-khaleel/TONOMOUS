import TextureCube from 'mediamonks-webgl/renderer/texture/TextureCube';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Camera from '../../renderer/camera/Camera';
import Cube from '../mesh/Cube';
import Shader from 'mediamonks-webgl/renderer/material/Shader';
import Material from 'mediamonks-webgl/renderer/material/Material';

export default class CubemapBackground {
  private material: Material;
  private textureCube: TextureCube;
  private cube: Cube;
  private renderer: Renderer;

  constructor(renderer: Renderer, preloader: WebGLPreLoader, cubemap: TextureCube) {
    this.renderer = renderer;

    this.textureCube = cubemap;

    const shader = new Shader(renderer);
    shader.init(
      'cubeMap',
      `attribute vec3 aPos;uniform vec3 _CP;uniform mat4 _VP;varying vec3 vN;void main(void) {vN = aPos;gl_Position = _VP * vec4(_CP + aPos, 1.0);}`,
      `precision mediump float; uniform samplerCube _T; varying vec3 vN; void main(void) {gl_FragColor = vec4(textureCube(_T, vN).xyz, 1);}`,
    );

    this.material = new Material(renderer, 'cubeMap', shader);

    this.material.depthTest = false;
    this.material.depthWrite = false;
    this.material.blend = false;
    this.material.setCullingDisabled();

    this.cube = new Cube(renderer);
  }

  public draw(camera: Camera): void {
    this.material.setTexture('_T', this.textureCube);
    this.material.setVector3('_CP', camera.worldPosition);
    this.material.setMatrix('_VP', camera.viewProjection);

    this.renderer.draw(this.cube, this.material);
  }

  public setTextureCube(tex: TextureCube) {
    this.textureCube = tex;
  }
}
