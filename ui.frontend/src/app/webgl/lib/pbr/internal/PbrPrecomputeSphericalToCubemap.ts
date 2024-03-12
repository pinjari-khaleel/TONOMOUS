import TextureCube from 'mediamonks-webgl/renderer/texture/TextureCube';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Material from 'mediamonks-webgl/renderer/material/Material';
import Texture from 'mediamonks-webgl/renderer/texture/Texture';
import Sphere from 'mediamonks-webgl/utils/mesh/Sphere';
import MaterialLoader from 'mediamonks-webgl/renderer/material/MaterialLoader';
import TextureFormat from '../../renderer/texture/TextureFormat';
import RenderTextureCube from '../../renderer/texture/RenderTextureCube';
import Camera from '../../renderer/camera/Camera';
import Matrix3x3 from 'mediamonks-webgl/renderer/math/Matrix3x3';

export default class PbrPrecomputeSphericalToCubemap {
  private _renderer: Renderer;
  private _environmentMesh: Mesh;
  private _material: Material;

  constructor(renderer: Renderer, preloader: WebGLPreLoader) {
    this._renderer = renderer;
    this._environmentMesh = new Sphere(renderer, 10, 32, 32);
    this._material = new MaterialLoader(this._renderer, preloader, 'spherical_to_cube');
  }

  public toCubemap(hdrEnvironment: Texture, resolution: number): TextureCube {
    // NOTE(Joey): process material
    this._material.setCullingDisabled();
    this._material.depthWrite = false;
    this._material.blend = false;
    this._material.setTexture('_Environment', hdrEnvironment);

    // NOTE(Joey): generate cubemap
    var cubemap: RenderTextureCube = new RenderTextureCube(
      this._renderer,
      resolution,
      true,
      TextureFormat.RGBA_FLOAT,
    );

    cubemap.renderToTexture((camera: Camera) => {
      var view = new Matrix3x3();
      Matrix3x3.fromMat4(view, camera.viewMatrix);
      this._material.setMatrix3x3('_View', view);
      this._material.setMatrix('_Projection', camera.projection.matrix);
      this._renderer.draw(this._environmentMesh, this._material);
    });

    cubemap.useMips = true;

    return cubemap;
  }
}
