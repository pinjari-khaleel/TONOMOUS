import Model from '../utils/model/Model';
import Renderer from '../renderer/render/Renderer';
import MaterialLoader from '../renderer/material/MaterialLoader';
import TextureCube from '../renderer/texture/TextureCube';
import Mesh from '../renderer/mesh/Mesh';
import WebGLPreLoader from '../renderer/core/WebGLPreLoader';
import Box from '../utils/mesh/Box';
import ParamGroup from '../utils/uiParams/ParamGroup';
import PbrEnvironment from './PbrEnvironment';
import Material from '../renderer/material/Material';
import FloatParam from '../utils/uiParams/FloatParam';
import { PbrConfig } from './PbrConfig';
import Camera from '../renderer/camera/Camera';

class PbrCubeMapBackground extends Model {
  private _renderer: Renderer;

  private _cubeMesh: Mesh;
  private _pbrEnvironment: PbrEnvironment | undefined;

  private _textureCube: TextureCube | undefined;
  public materialCube: MaterialLoader;

  private _materials: Material[] = [];
  public lodParam!: FloatParam;

  public static instanceExists: boolean = false;

  constructor(renderer: Renderer, preloader: WebGLPreLoader) {
    super();

    PbrCubeMapBackground.instanceExists = true;

    this._renderer = renderer;

    this.materialCube = new MaterialLoader(renderer, preloader, 'backgroundCube');

    this.materialCube.setCullingDisabled();
    this.materialCube.depthWrite = false;
    this.materialCube.blend = false;

    this._materials.push(this.materialCube);

    if (!PbrConfig.useFloatTextures) {
      for (var i = 0; i < this._materials.length; i++) {
        this._materials[i].addShaderDefines('LDR_MAPS');
      }
    }
    if (!renderer.extensionManager.shader_texture_lod) {
      for (var i = 0; i < this._materials.length; i++) {
        this._materials[i].addShaderDefines('NO_LOD_EXTENSION');
      }
    }

    this._cubeMesh = new Box(renderer);
  }

  public init(paramGroup: ParamGroup, environment: PbrEnvironment, defaultLod: number = 0): void {
    this.setPbrEnvironment(environment);

    var params: ParamGroup = paramGroup.addGroup('Background', this.allMaterials());

    this.lodParam = params.addShaderParamFloat(
      '_Lod',
      defaultLod,
      0,
      environment.mipmapWithMaxRoughness,
    );
  }

  public allMaterials(): Material[] {
    return this._materials;
  }

  public draw(camera: Camera, materialOverride: Material | null = null): void {
    if (!this._textureCube) {
      throw new Error('cannot draw() on PbrCubeMapBackground: setPbrEnvironment not yet called');
    }
    var camParent = camera.view.transform.getParent();

    var material: Material = this.materialCube;

    material.setTexture('_CubeSampler', this._textureCube);

    //use on a cube (also adjust shader)
    /*            material.setFloat("_Farplane", camera.getProjection().getFarPlane());
		 material.setMatrix3x3("_View", view);
		 material.setMatrix("_Projection", camera.getProjection().matrix);
		 this._renderer.draw(this._cubeMesh, material);*/

    //use on a quad
    material.setVector3('_FrustumCorner', camera.projection.frustumCorner);

    if (camParent) {
      material.setMatrix3x3('_CameraRotation', camParent.rotationMatrixMat3);
    } else {
      material.setMatrix3x3('_CameraRotation', camera.view.transform.rotationMatrixMat3);
    }

    this._renderer.blit(null, null, material, false);
  }

  public setPbrEnvironment(environment: PbrEnvironment) {
    this._pbrEnvironment = environment;
    this._textureCube = environment.specularCube;
  }
}

export default PbrCubeMapBackground;
