import MaterialInstance from 'mediamonks-webgl/unity/MaterialInstance';
import { Animator } from 'mediamonks-webgl/utils/animation/Animator';
import Vector4 from 'mediamonks-webgl/renderer/math/Vector4';
import UnityMaterial from 'mediamonks-webgl/unity/UnityMaterial';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import Model from '../utils/model/Model';

export default class UnityModel extends Model {
  public materialInstance!: MaterialInstance;
  public animator: Animator | null = null;
  public visible: boolean = true;
  public lodVisible: boolean = true;
  public skinned: boolean = false;
  public static: boolean = true;
  public lightMapScaleOffset: Vector4 = new Vector4(1, 1, 0, 0);
  public isStatic: boolean = true; //can be merged when not transparent
  public sphereCollider: Vector4 = new Vector4(0, 0, 0, 0);

  public get sharedMaterial(): UnityMaterial {
    return this.materialInstance.sharedMaterial;
  }

  public draw(camera: Camera) {
    if (!this.visible) return;

    const material = this.sharedMaterial;

    this.materialInstance.setInstanceUniforms();
    if (this.animator) {
      if (material.skinned) {
        //TODO: 2 mesh renderers could share an animator. Do not set twice
        if (this.animator.boneTexture) {
          material.setTexture('_BoneTexture', this.animator.boneTexture);
          material.setFloat('_BoneTextureWidth', this.animator.boneTexture.width);
        } else {
          material.setMatrixFloatArray('_BoneMatrices', this.animator.boneMatrices);
        }
      }
    }
    material.setCullingBackFace();
    material.setVector4('_lightMapScaleOffset', this.lightMapScaleOffset);
    material.setVector3('_CamPos', camera.worldPosition);
    material.setMatrix('_ViewProjection', camera.viewProjection);
    material.setMatrix('_Model', this.transform.worldMatrix);
    this.mesh.renderer.draw(this.mesh, material);
  }
}
