import AnimationClip from 'mediamonks-webgl/utils/animation/AnimationClip';
import { Animator } from 'mediamonks-webgl/utils/animation/Animator';
import KeyframeTrack from 'mediamonks-webgl/utils/animation/KeyframeTrack';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
import Matrix4x4 from 'mediamonks-webgl/renderer/math/Matrix4x4';
import IWebGLDestructible from '../renderer/core/IWebGLDestructible';

export class BoneHierarchy {
  public animatorId: number = -1;
  public rootTransformId: number = -1;
  //sequence is important for skinned mesh renderer
  public boneIds: number[] = [];
  public bindPoses: Matrix4x4[] = [];
}

export default class UnityAnimator implements IWebGLDestructible {
  public animators: Animator[] = [];
  public animatorsById: { [id: number]: Animator } = {};
  public boneHierarchies: BoneHierarchy[] = [];
  public clips: AnimationClip[] = [];
  public clipsById: { [id: number]: AnimationClip } = {};

  public addClip(clip: AnimationClip) {
    this.clipsById[clip.id] = clip;
    this.clips.push(clip);
  }

  public addAnimator(animator: Animator) {
    this.animatorsById[animator.id] = animator;
    this.animators.push(animator);
  }

  public getClipByName(name: string): AnimationClip | null {
    for (const clip of this.clips) {
      if (clip.name == name) return clip;
    }
    console.warn('getClipByName: not found', name, this.clips);
    return null;
  }

  public getValueOfTrack(name: string, time: number): number {
    //can't be a dict because we need the clip time
    for (const animator of this.animators) {
      for (const clip of animator.clips) {
        for (const track of clip.tracks) {
          if (track.name.indexOf(name) >= 0) {
            return track.evaluate(time);
          }
        }
      }
    }
    return 0;
  }

  public getTrack(name: string): KeyframeTrack | null {
    for (const animator of this.animators) {
      for (const clip of animator.clips) {
        for (const track of clip.tracks) {
          if (track.name.indexOf(name) >= 0) {
            return track;
          }
        }
      }
    }
    return null;
  }

  public update(time: number) {
    for (const animator of this.animators) animator.update(time);
  }

  public getEventTimeByName(name: string) {
    for (const animator of this.animators) {
      for (const clip of animator.clips) {
        for (const event of clip.events) {
          if (name == event.name) return event.time;
        }
      }
    }
    if (LogGL.ENABLED) console.warn('event not found', name, this.animators);
    return 0;
  }

  public destruct(destructTextures: boolean = true) {
    for (const animator of this.animators) {
      animator.destruct();
    }
  }
}
