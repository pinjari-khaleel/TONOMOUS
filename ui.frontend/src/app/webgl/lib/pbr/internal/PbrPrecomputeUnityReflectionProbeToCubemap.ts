import TextureCube from 'mediamonks-webgl/renderer/texture/TextureCube';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Material from 'mediamonks-webgl/renderer/material/Material';
import Texture from 'mediamonks-webgl/renderer/texture/Texture';
import MaterialLoader from 'mediamonks-webgl/renderer/material/MaterialLoader';
import TextureFormat from '../../renderer/texture/TextureFormat';
import RenderTextureCube from '../../renderer/texture/RenderTextureCube';
import Camera from '../../renderer/camera/Camera';
import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';

export default class PbrPrecomputeUnityReflectionProbeToCubemap {
  private _renderer: Renderer;
  private _material: Material;

  constructor(renderer: Renderer, preloader: WebGLPreLoader) {
    this._renderer = renderer;
    // this._environmentMesh = new Sphere(renderer, 32, 32, 10.0);
    this._material = new MaterialLoader(this._renderer, preloader, 'probe_to_cube');
  }

  public toCubemap(hdrEnvironment: Texture, resolution: number): TextureCube {
    // NOTE(Joey): process material
    this._material.setCullingDisabled();
    this._material.depthWrite = false;
    this._material.blend = false;
    this._material.setTexture('_Texture', hdrEnvironment);

    // NOTE(Joey): generate cubemap
    var cubemap: RenderTextureCube = new RenderTextureCube(
      this._renderer,
      resolution,
      true,
      TextureFormat.RGBA_FLOAT,
    );

    cubemap.renderToTexture((camera: Camera, side?: number) => {
      // public static TEXTURE_CUBE_MAP_POSITIVE_X: number = 34069;
      // public static TEXTURE_CUBE_MAP_NEGATIVE_X: number = 34070;
      // public static TEXTURE_CUBE_MAP_POSITIVE_Y: number = 34071;
      // public static TEXTURE_CUBE_MAP_NEGATIVE_Y: number = 34072;
      // public static TEXTURE_CUBE_MAP_POSITIVE_Z: number = 34073;
      // public static TEXTURE_CUBE_MAP_NEGATIVE_Z: number = 34074;

      switch (side) {
        case 0:
          this._material.setVector2('_Scale', new Vector2(-1 / 6, -1));
          this._material.setVector2('_Offset', new Vector2(2 / 6, 1));
          break;
        case 1:
          this._material.setVector2('_Scale', new Vector2(-1 / 6, -1));
          this._material.setVector2('_Offset', new Vector2(1 / 6, 1));
          break;
        case 2:
          this._material.setVector2('_Scale', new Vector2(-1 / 6, -1));
          this._material.setVector2('_Offset', new Vector2(3 / 6, 1));
          break;
        case 3:
          this._material.setVector2('_Scale', new Vector2(-1 / 6, -1));
          this._material.setVector2('_Offset', new Vector2(4 / 6, 1));
          break;
        case 4:
          this._material.setVector2('_Scale', new Vector2(-1 / 6, -1));
          this._material.setVector2('_Offset', new Vector2(5 / 6, 1));
          break;
        case 5:
          this._material.setVector2('_Scale', new Vector2(-1 / 6, -1));
          this._material.setVector2('_Offset', new Vector2(6 / 6, 1));
          break;
      }
      console.log(side);

      this._renderer.blit(null, null, this._material);
    });

    cubemap.useMips = true;

    return cubemap;
  }
}
