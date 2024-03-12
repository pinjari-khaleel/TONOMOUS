import AnimationClip from './AnimationClip';
import Transform from '../../renderer/core/Transform';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';
import KeyframeTrack, {
  TrackType,
  TransformTrack,
} from 'mediamonks-webgl/utils/animation/KeyframeTrack';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import Texture2D from 'mediamonks-webgl/renderer/texture/Texture2D';
import TextureFormat from 'mediamonks-webgl/renderer/texture/TextureFormat';
import Renderer from 'mediamonks-webgl/renderer/render/Renderer';
import Utils from 'mediamonks-webgl/renderer/core/Utils';

export class Animator {
  public readonly transform: Transform;
  public readonly id: number = 0;

  public readonly clips: AnimationClip[];
  public readonly transformsTracks: TransformTrack[] = [];
  public readonly useTexture: boolean;

  public boneMatrices!: Float32Array;
  public bones: Transform[] = [];
  public bindPoses: Matrix4x4[] = [];
  public boneTexture!: Texture2D;

  private tempMat4 = new Matrix4x4();

  constructor(
    renderer: Renderer,
    id: number,
    rootTransform: Transform,
    clips: AnimationClip[],
    bones: Transform[] = [],
    bindPoses: Matrix4x4[] = [],
    findTransformsByName: boolean = true,
  ) {
    this.id = id;
    this.transform = rootTransform;
    this.clips = clips;

    this.bones = bones;
    this.bindPoses = bindPoses;

    this.useTexture = renderer.maxParams.MAX_VERTEX_UNIFORM_VECTORS / 4 < this.bones.length + 4;
    if (LogGL.ENABLED)
      console.log(
        'Animator: useTexture',
        this.useTexture,
        'MAX_VERTEX_UNIFORM_VECTORS',
        renderer.maxParams.MAX_VERTEX_UNIFORM_VECTORS,
        'bones',
        this.bones.length,
      );

    this.initBoneStorageData(renderer, this.bones.length);

    if (clips.length > 0) {
      this.transformsTracks = this.createTransformTracks(
        clips[0].tracks,
        rootTransform.getChildrenRecursive(),
        findTransformsByName,
      );
      if (clips.length > 1) {
        console.warn('multiple clips currently not supported', clips);
      }
    }
  }

  private initBoneStorageData(renderer: Renderer, numBones: number) {
    this.boneMatrices = new Float32Array(numBones * 16);

    if (this.useTexture) {
      this.boneTexture = new Texture2D(renderer, TextureFormat.RGBA_FLOAT, false, false, true);
      this.boneTexture.setData(this.boneMatrices, numBones * 4, 1);
    }
  }

  public getTracksByName(name: string): KeyframeTrack[] {
    const acc: KeyframeTrack[] = [];
    this.clips.forEach((clip) => acc.concat(clip.getTracksByName(name)));
    return acc;
  }

  public createTransformTracks(
    tracks: KeyframeTrack[],
    transforms: Transform[],
    findTransformsByName: boolean = true,
  ): TransformTrack[] {
    const transformTracksByName: { [name: string]: KeyframeTrack[] } = {};

    for (const track of tracks) {
      const id = findTransformsByName ? track.name : track.transformId;
      if (
        track.type == TrackType.PositionX ||
        track.type == TrackType.PositionY ||
        track.type == TrackType.PositionZ ||
        track.type == TrackType.RotationX ||
        track.type == TrackType.RotationY ||
        track.type == TrackType.RotationZ ||
        track.type == TrackType.RotationW ||
        track.type == TrackType.ScaleX ||
        track.type == TrackType.ScaleY ||
        track.type == TrackType.ScaleZ
      ) {
        if (!transformTracksByName[id]) transformTracksByName[id] = [];
        transformTracksByName[id].push(track);
      }
    }

    const transformTracks: TransformTrack[] = [];
    for (const t of transforms) {
      const id = findTransformsByName ? t.name : t.id;
      if (transformTracksByName[id]) {
        transformTracks.push(new TransformTrack(t, transformTracksByName[id]));
      }
    }
    return transformTracks;
  }

  public update(timeOrProgress: number, setProgress: boolean = false) {
    for (const clip of this.clips) {
      for (const track of this.transformsTracks) {
        track.update(
          setProgress
            ? Utils.clamp01(timeOrProgress) * clip.duration
            : timeOrProgress % clip.duration,
        );
      }
    }
    this.updateSkinningMatrices();

    if (this.useTexture) {
      const boneTexture = <Texture2D>this.boneTexture;
      boneTexture.setData(this.boneMatrices, boneTexture.width, boneTexture.height);
    }
  }

  public updateBoneStorageData(bones: Transform[]) {
    /*
        if (this.rootTransform) {
          Matrix4x4.invert(this.rootInverseMat4, this.rootTransform.worldMatrix);
        } else {
          Matrix4x4.identity(this.rootInverseMat4);
        }

        let boneIndex = 0;
        for (const bone of bones) {
          if (bone.id === -1) {
            throw new ReferenceError('expected all transforms to have an id');
          }
          Matrix4x4.multiply(this.tempMat4, bone.worldMatrix, this.getCachedBoneTransform(bone.id).inverseBindpose);
          Matrix4x4.multiply(this.tempMat4, this.rootInverseMat4, this.tempMat4);

          // mat4.multiply(this.tempMat4, this.tempMat4,
          // this.getCachedBoneTransform(bone.id).bindTransform.getLocalMatrix());

          const offset = boneIndex * 16;
          for (let i = 0; i < 16; i++) {
            this.boneMatrices[offset + i] = this.tempMat4.m[i];
          }
          boneIndex++;
        }*/
    if (this.useTexture) {
      const boneTexture = <Texture2D>this.boneTexture;
      boneTexture.setData(this.boneMatrices, boneTexture.width, boneTexture.height);
    }
  }

  private updateSkinningMatrices() {
    let ii = 0;
    for (let i = 0; i < this.bones.length; i++) {
      Matrix4x4.multiply(this.tempMat4, this.bones[i].worldMatrix, this.bindPoses[i]);
      for (let j = 0; j < 16; j++) {
        this.boneMatrices[ii++] = this.tempMat4.m[j];
      }
    }
  }

  public destruct() {
    for (const clip of this.clips) clip.destruct();
  }
}
