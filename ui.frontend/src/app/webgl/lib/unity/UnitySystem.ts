import UnityAnimator from './UnityAnimator';
import Transform from 'mediamonks-webgl/renderer/core/Transform';
import { UnityComponents } from './UnityComponentParser';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import UnityLoader from './UnityLoader';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import Vector4 from 'mediamonks-webgl/renderer/math/Vector4';
import MeshUtils from 'mediamonks-webgl/utils/mesh/MeshUtils';
import Frustum from 'mediamonks-webgl/utils/camera/Frustum';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import UnityMaterial from './UnityMaterial';
import UnityModel from 'mediamonks-webgl/unity/UnityModel';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import MeshMerger from 'mediamonks-webgl/utils/mesh/MeshMerger';
import IWebGLDestructible from '../renderer/core/IWebGLDestructible';
import AABox from '../renderer/math/AABox';

export default class UnitySystem implements IWebGLDestructible {
  private readonly renderer: Renderer;
  public readonly unityAnimator: UnityAnimator;
  public components: UnityComponents;

  public readonly transforms: Transform[] = [];
  public readonly transformsById: { [id: number]: Transform } = {};
  private readonly transformsByName: { [name: string]: Transform } = {};

  public readonly materials: UnityMaterial[] = [];
  public readonly materialsByName: { [name: string]: UnityMaterial } = {};
  public readonly materialById: { [id: number]: UnityMaterial } = {};

  public readonly meshes: Mesh[] = [];
  public readonly meshById: { [id: string]: Mesh } = {};

  public readonly models: UnityModel[] = [];
  public readonly modelsById: { [id: number]: UnityModel[] } = {};
  private readonly sorted: UnityModel[] = [];

  constructor(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    jsonURL: string | Object | Promise<any>,
    texturePool: { [url: string]: Texture2D },
    materialPool: { [name: string]: UnityMaterial },
    getTextureURL: ((name: string, noCompression: boolean) => string) | null = null,
  ) {
    this.unityAnimator = new UnityAnimator();
    this.components = new UnityComponents();

    this.renderer = renderer;

    UnityLoader.load(renderer, preloader, jsonURL, this, texturePool, materialPool, getTextureURL);
  }

  public handleLoaded(): void {
    for (const material of this.materials) {
      material.init();
    }
    for (const model of this.models) {
      if (model.sharedMaterial.normalMap) {
        if (MeshUtils.addTangents(model.mesh)) {
          if (LogGL.ENABLED) console.log('added tangents', model.transform.name);
        }
      }
    }

    // this.mergeMeshes(this.meshRenderers);

    for (const model of this.models) {
      this.sorted.push(model);
    }
  }

  private mergeMeshes(models: UnityModel[]) {
    if (LogGL.ENABLED) {
      console.log('mergeMeshes: before', models.length);
    }
    const modelsByMaterial: { [name: string]: UnityModel[] } = {};

    for (const model of models) {
      if (model.static) {
        //skip LODs
        let skip = false;
        for (const lod of this.components.lods) {
          if (lod.m0 == model || lod.m1 == model) skip = true;
        }
        if (skip) continue;
        if (!modelsByMaterial[model.sharedMaterial.name])
          modelsByMaterial[model.sharedMaterial.name] = [];
        modelsByMaterial[model.sharedMaterial.name].push(model);
      }
    }

    for (const key in modelsByMaterial) {
      const models = modelsByMaterial[key];

      if (models.length > 0) {
        //if one mesh in the collection is visible then the merged mesh(es) will be

        const meshes = [];
        const transforms = [];
        const lightMapOffsets = [];
        const mergedBoundingBox = new AABox();

        for (let model of models) {
          transforms.push(model.transform);
          meshes.push(model.mesh);
          lightMapOffsets.push(model.lightMapScaleOffset);
          mergedBoundingBox.expandWithAABox(model.boundingBox);
        }
        const merged = MeshMerger.merge(meshes, transforms, lightMapOffsets);
        const model = new UnityModel();
        model.mesh = merged;
        model.materialInstance = models[0].materialInstance;
        model.transform = new Transform();
        model.transform.name = model.sharedMaterial.name;
        // model.doFrustumCull = false;
        model.boundingBox = mergedBoundingBox;
        this.models.unshift(model);
        for (let model of models) {
          //can't really destruct the old mesh because it might be used with a different material or in a non-static mesh
          this.models.splice(this.models.indexOf(model), 1);
        }
      }
    }

    if (LogGL.ENABLED) {
      console.log('mergeMeshes: after', this.models.length);
    }
  }

  private arraysEqual(a: UnityModel[], b: UnityModel[]) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  public update(animationTime: number): void {
    this.unityAnimator.update(animationTime);
  }

  public draw(camera: Camera, frustum: Frustum | null = null) {
    for (const model of this.sorted) {
      if (!(model.visible && model.lodVisible)) continue;

      if (model.sphereCollider.w > 0) {
        if (
          frustum &&
          !frustum.sphereInFrustum(
            Vector3.add(
              model.transform.worldPosition,
              new Vector3(model.sphereCollider.x, model.sphereCollider.y, model.sphereCollider.z),
            ),
            model.sphereCollider.w,
          )
        )
          continue;
      }

      model.draw(camera);
    }
  }

  public addMeshRenderer(model: UnityModel): void {
    this.models.push(model);

    //a transform can have multiple models because of multisub
    if (!this.modelsById[model.transform.id]) {
      this.modelsById[model.transform.id] = [];
    }
    this.modelsById[model.transform.id].push(model);
  }

  public addMesh(mesh: Mesh, id: string): void {
    this.meshes.push(mesh);
    this.meshById[id] = mesh;
  }

  public addMaterial(material: UnityMaterial, id: number): void {
    this.materials.push(material);
    this.materialsByName[material.name] = material;
    this.materialById[id] = material;
  }

  public getMaterialByName(name: string) {
    return this.materialsByName[name];
  }

  public getRenderersById(id: number): UnityModel[] {
    if (this.modelsById[id] == null) return [];
    return this.modelsById[id];
  }

  public getRenderersByName(name: string): UnityModel[] {
    const result = [];
    for (const model of this.models) {
      if (model.transform.name == name) result.push(model);
    }
    return result;
  }

  public setFloatUniform(name: string, value: number) {
    this.materials.forEach((material) => {
      material.setFloat(name, value);
    });
  }

  public setColor(name: string, value: Vector4) {
    this.materials.forEach((material) => {
      material.setVector4(name, value);
    });
  }

  public addTransform(transform: Transform): void {
    this.transforms.push(transform);
    this.transformsById[transform.id] = transform;
    this.transformsByName[transform.name] = transform;
  }

  public getTransformById(id: number) {
    return this.transformsById[id];
  }

  public getTransformByName(name: string): Transform | null {
    return this.transformsByName[name];
  }

  public get rootTransform(): Transform {
    return this.transforms[0];
  }

  public getModelsRecursive(t: Transform): UnityModel[] {
    let models: UnityModel[] = [];
    models = models.concat(this.getRenderersById(t.id));
    for (const child of t.getChildren()) {
      models = models.concat(this.getModelsRecursive(child));
    }
    return models;
  }

  public destruct(destructTextures: boolean = true) {
    this.unityAnimator.destruct();
    this.components?.destruct();
    for (const mesh of this.meshes) mesh.destruct();
    //materials and textures stored in a pool
  }
}
