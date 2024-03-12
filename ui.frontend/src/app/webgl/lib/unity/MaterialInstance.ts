import UnityMaterial from './UnityMaterial';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';

//unique uniforms on shared materials (float uniforms can be animated)
export default class MaterialInstance {
  public sharedMaterial: UnityMaterial;
  public uniforms: { name: string; value: number[] }[] = [];
  public lightMap: Texture2D | null = null;
  public cullBack: boolean = true;

  constructor(sharedMaterial: UnityMaterial) {
    this.sharedMaterial = sharedMaterial;
    //deep copy
    this.uniforms = JSON.parse(JSON.stringify(this.sharedMaterial.uniforms));
  }

  public setInstanceUniforms() {
    this.cullBack
      ? this.sharedMaterial.setCullingBackFace()
      : this.sharedMaterial.setCullingFrontFace();
    //this is needed because the renderState checks if the materials properties have been set already
    this.sharedMaterial.renderer.renderState.setCulling(this.sharedMaterial.culling);

    this.sharedMaterial.setFloatUniforms(this.uniforms);
  }

  public setFloat(name: string, channel: number, value: number) {
    for (const u of this.uniforms) {
      if (u.name == name) {
        u.value[channel] = value;
        break;
      }
    }
  }
}
