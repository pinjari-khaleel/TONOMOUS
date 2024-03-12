import UnitySystem from './UnitySystem';
import TextLoader from 'mediamonks-webgl/utils/loaders/TextLoader';
import Transform from 'mediamonks-webgl/renderer/core/Transform';
import { Animator } from 'mediamonks-webgl/utils/animation/Animator';
import AnimationClip from 'mediamonks-webgl/utils/animation/AnimationClip';
import Mesh from 'mediamonks-webgl/renderer/mesh/Mesh';
import UnityComponentParser from './UnityComponentParser';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import WebGLPreLoader from 'mediamonks-webgl/renderer/core/WebGLPreLoader';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Quaternion from 'mediamonks-webgl/renderer/math/Quaternion';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import MaterialInstance from './MaterialInstance';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';
import UnityMaterial, { IUnityTextureInfo } from './UnityMaterial';
import { BoneHierarchy } from './UnityAnimator';
import UnityModel from 'mediamonks-webgl/unity/UnityModel';
import JSONLoader from 'mediamonks-webgl/utils/loaders/JSONLoader';

export default class UnityLoader {
  public static load(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    urlOrJson: string | Object | Promise<any>,
    unity: UnitySystem,
    texturePool: { [url: string]: Texture2D },
    materialPool: { [name: string]: UnityMaterial },
    getTextureURL: ((name: string, noCompression: boolean) => string) | null = null,
  ) {
    const loader = new JSONLoader(preloader, urlOrJson);
    preloader.setCallbackForPreloadable(loader, () => {
      UnityLoader.parseJson(
        renderer,
        preloader,
        loader.data,
        unity,
        texturePool,
        materialPool,
        getTextureURL,
      );
    });
  }

  public static parseJson(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    data: any,
    unity: UnitySystem,
    texturePool: { [url: string]: Texture2D },
    materialPool: { [name: string]: UnityMaterial },
    getTextureURL: ((name: string, noCompression: boolean) => string) | null = null,
  ) {
    if (LogGL.ENABLED) console.log('parseJson', data);

    this.parseTransforms(data, unity);
    this.parseMaterials(renderer, preloader, data, unity, texturePool, materialPool, getTextureURL);
    this.parseClips(renderer, data, unity);
    this.parseBoneHierarchies(data, unity);
    this.parseAnimators(renderer, data, unity);
    this.parseMeshes(renderer, data, unity);
    this.parseModels(renderer, preloader, data, unity);
    this.parseComponents(data, unity);
  }

  private static parseTransforms(data: any, unity: UnitySystem) {
    for (let i = 0; i < data.transforms.length; i++) {
      let td = data.transforms[i];

      let transform = this.transformFromData(td);

      if (unity.getTransformById(td.parentId)) {
        transform.setParent(unity.getTransformById(td.parentId));
      }
      unity.addTransform(transform);
    }
  }

  private static transformFromData(td: any): Transform {
    let transform = new Transform();
    transform.setPositionRotationScale(
      new Vector3(...td.position),
      new Quaternion(...td.rotation),
      new Vector3(...td.scale),
    );
    transform.name = td.name;
    transform.id = td.id;
    return transform;
  }

  private static parseMaterials(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    data: any,
    unity: UnitySystem,
    texturePool: { [url: string]: Texture2D },
    materialPool: { [name: string]: UnityMaterial },
    getTextureURL: ((name: string, noCompression: boolean) => string) | null = null,
  ) {
    const textureInfoByName: { [name: string]: IUnityTextureInfo } = {};
    for (let textureInfo of data.textures) {
      textureInfoByName[textureInfo.name] = textureInfo;
    }
    // if (LogGL.ENABLED) console.log('textureInfoByName', textureInfoByName);

    for (let materialInfo of data.materials) {
      if (unity.getMaterialByName(materialInfo.name) == null) {
        if (materialPool[materialInfo.name]) {
          unity.addMaterial(materialPool[materialInfo.name], materialInfo.id);
        } else {
          let material = new UnityMaterial(
            renderer,
            preloader,
            materialInfo,
            texturePool,
            textureInfoByName,
            getTextureURL,
          );
          materialPool[materialInfo.name] = material;
          unity.addMaterial(material, materialInfo.id);
        }
        // } else {
        //   if (LogGL.ENABLED) console.log('shared material', materialInfo.name);
      }
    }
  }

  private static parseClips(renderer: Renderer, data: any, unity: UnitySystem) {
    let clips: AnimationClip[] = [];

    for (const clipData of data.clips) {
      const clip = AnimationClip.parseJSON(clipData);
      clips.push(clip);
      unity.unityAnimator.addClip(clip);
    }

    /* if (LogGL.ENABLED) {
       let trackCount: number = 0;
       let keyCount: number = 0;
       for (const clip of clips) {
         trackCount += clip.tracks.length;
         console.log('clip.tracks', clip.tracks);
         for (const track of clip.tracks) {
           keyCount += track.values.length;
         }
       }
       console.log('trackCount', trackCount);
       console.log('keyCount', keyCount);
     }*/
  }

  private static parseBoneHierarchies(data: any, unity: UnitySystem) {
    for (const boneHierarchy of data.boneHierarchies) {
      const bindPoses: Matrix4x4[] = [];
      const transformIds: number[] = [];
      for (const bone of boneHierarchy.bones) {
        const bindPose = new Matrix4x4();
        const bindTransform = this.transformFromData(bone);
        Matrix4x4.invert(bindPose, bindTransform.localMatrix);
        bindPoses.push(bindPose);
        transformIds.push(bone.transformId);
      }
      const hierarchy = new BoneHierarchy();
      hierarchy.animatorId = boneHierarchy.animatorId;
      hierarchy.rootTransformId = boneHierarchy.transformId;
      hierarchy.boneIds = transformIds;
      hierarchy.bindPoses = bindPoses;
      unity.unityAnimator.boneHierarchies.push(hierarchy);
    }
  }

  private static parseAnimators(renderer: Renderer, data: any, unity: UnitySystem) {
    for (const anim of data.animators) {
      let clips: AnimationClip[] = [];
      let bones: Transform[] = [];
      let bindPoses: Matrix4x4[] = [];

      for (const clipId of anim.clipIDs) {
        clips.push(unity.unityAnimator.clipsById[clipId]);
      }

      const root = unity.transformsById[anim.transformId];
      for (const boneHierarchy of unity.unityAnimator.boneHierarchies) {
        if (boneHierarchy.animatorId == anim.id) {
          for (const id of boneHierarchy.boneIds) {
            bones.push(unity.getTransformById(id));
          }
          bindPoses = boneHierarchy.bindPoses;
          if (LogGL.ENABLED) console.log('found a boneHierarchy for an animator:', root.name);
          break;
        }
      }

      const animator = new Animator(renderer, anim.id, root, clips, bones, bindPoses);
      unity.unityAnimator.addAnimator(animator);
    }
  }

  public static parseMeshes(renderer: Renderer, data: any, unity: UnitySystem) {
    for (const od of data.meshes) {
      UnityLoader.parseMesh(renderer, od, unity);
    }
    // if (LogGL.ENABLED) console.log('imported meshes: unique', unity.meshes.length);
  }

  public static parseMesh(renderer: Renderer, data: any, unity: UnitySystem) {
    const meshId = data.instanceId;

    if (!unity.meshById[meshId]) {
      const mesh = new Mesh(renderer);
      mesh.name = data.name;

      for (const attribute of data.attributes) {
        mesh.setAttribute(attribute.name, attribute.stride, new Float32Array(attribute.data));
      }

      if (data.indices.length > 0) {
        if (mesh.getNumVertices() < 65536) {
          mesh.setIndices(new Uint16Array(data.indices));
        } else {
          mesh.setIndices32(new Uint32Array(data.indices));
        }
      }

      unity.addMesh(mesh, meshId);
    } else {
      console.error('mesh has duplicate id', data.meshId);
    }
  }

  public static parseModels(
    renderer: Renderer,
    preloader: WebGLPreLoader,
    data: any,
    unity: UnitySystem,
  ) {
    let vertexCount: number = 0;

    for (const modelData of data.models) {
      let model = new UnityModel();

      if (unity.getTransformById(modelData.transformId) != null) {
        model.transform = unity.getTransformById(modelData.transformId);
      } else {
        console.error('transform not found for model');
      }

      model.boundingBox.setCenterExtents(
        new Vector3(...modelData.bbCenter),
        new Vector3(...modelData.bbExtents),
      );
      model.sphereCollider.setValues(
        modelData.sphereCollider[0],
        modelData.sphereCollider[1],
        modelData.sphereCollider[2],
        modelData.sphereCollider[3],
      );
      model.isStatic = modelData.isStatic;

      let material = unity.materialById[modelData.materialId];
      if (material != null) {
        model.materialInstance = new MaterialInstance(material);
      } else {
        console.error('material not found for model', model.transform.name, modelData.material);
      }
      model.skinned = material.skinned;
      model.mesh = unity.meshById[modelData.meshId];
      model.animator = unity.unityAnimator.animatorsById[modelData.animatorId];
      if (model.animator) {
        model.sharedMaterial.setBoneCount(model.animator.bones.length, model.animator.useTexture);
      }
      model.static = modelData.isStatic;
      const l = modelData.lightmapScaleOffset;
      model.lightMapScaleOffset.setValues(l[0], l[1], l[2], l[3]);

      const m = model.transform.worldMatrix;
      model.materialInstance.cullBack = m.m[0] * m.m[5] * m.m[10] > 0;

      if (!model.mesh) {
        console.error('mesh not found for model', modelData.meshId);
      }
      vertexCount += model.mesh.getNumVertices();

      unity.addMeshRenderer(model);
    }

    if (LogGL.ENABLED)
      console.log('imported model: vertexCount', vertexCount, 'objects', unity.models.length);
  }

  private static parseComponents(data: any, unity: UnitySystem) {
    unity.components = UnityComponentParser.parseComponents(data, unity);
  }
}
