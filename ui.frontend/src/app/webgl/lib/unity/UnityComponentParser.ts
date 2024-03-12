import UnitySystem from './UnitySystem';
import AnimationClip from 'mediamonks-webgl/utils/animation/AnimationClip';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import UnityModel from 'mediamonks-webgl/unity/UnityModel';
import IWebGLDestructible from '../renderer/core/IWebGLDestructible';

export class UnityComponents implements IWebGLDestructible {
  public sceneReferences!: SceneReferencesData;
  public lods: Lod[] = [];
  public mergeGroups: number[][] = [];
  public lights: LightData[] = [];

  public destruct() {}
}

export class Lod {
  public m0: UnityModel;
  public m1: UnityModel;
  public distance: number;

  constructor(m0: UnityModel, m1: UnityModel, distance: number) {
    this.m0 = m0;
    this.m1 = m1;
    this.distance = distance;
  }

  //pivot has to be centered for this to work
  public update(cameraPos: Vector3) {
    const d = Vector3.distance(cameraPos, this.m0.transform.worldPosition);
    this.m0.lodVisible = d < this.distance;
    this.m1.lodVisible = d > this.distance;
  }
}

export class SceneReferencesData {
  public mainTimeline: AnimationClip | null = null;
}

export class LightData {
  public position: Vector3;
  public range: number;
  public color: Vector3;
  public intensity: number;

  constructor(data: any) {
    this.position = new Vector3(data.position[0], data.position[1], data.position[2]);
    this.range = data.range;
    this.color = new Vector3(data.color[0], data.color[1], data.color[2]);
    this.intensity = data.intensity;
  }
}

export default class UnityComponentParser {
  public static parseComponents(data: any, unity: UnitySystem): UnityComponents {
    const components = unity.components;

    if (data.sceneReferences) {
      components.sceneReferences = new SceneReferencesData();
      components.sceneReferences.mainTimeline = unity.unityAnimator.getClipByName(
        data.sceneReferences.timelineName,
      );
    }

    if (data.mergeGroups) {
      for (let mergeGroupData of data.mergeGroups) {
        components.mergeGroups.push(mergeGroupData.ids);
      }
    }

    for (const lodData of data.lods) {
      const t0 = unity.transformsById[lodData.id0];
      if (!t0) console.error('lods: transform 0 not found', lodData, lodData.id0);
      const t1 = unity.transformsById[lodData.id1];
      if (!t1) console.error('lods: transform 1 not found', lodData, lodData.id1);
      components.lods.push(
        new Lod(
          unity.modelsById[lodData.id0][0],
          unity.modelsById[lodData.id1][0],
          lodData.distance,
        ),
      );
    }

    if (data.lights) {
      for (const d of data.lights) {
        components.lights.push(new LightData(d));
      }
    }

    return components;
  }
}
