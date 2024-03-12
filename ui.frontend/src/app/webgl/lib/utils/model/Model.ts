import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import Material from 'mediamonks-webgl/renderer/material/Material';
import Transform from 'mediamonks-webgl/renderer/core/Transform';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';
import AABox from '../../renderer/math/AABox';

export default class Model implements IWebGLDestructible {
  public materialName?: string;
  public name?: string;

  public mesh!: Mesh;
  public material!: Material;
  public transform: Transform;
  public boundingBox: AABox = new AABox();

  constructor(
    mesh: Mesh | null = null,
    transform: Transform | null = null,
    material: Material | null = null,
  ) {
    if (mesh) this.mesh = mesh;
    this.transform = transform ?? new Transform();
    if (material) this.material = material;
  }

  public clone(): Model {
    return new Model(this.mesh, this.transform.clone(), this.material);
  }

  public destruct(): void {}
}
