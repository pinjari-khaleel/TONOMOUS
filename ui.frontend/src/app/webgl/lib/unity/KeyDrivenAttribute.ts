import KeyframeTrack, { TrackType } from 'mediamonks-webgl/utils/animation/KeyframeTrack';
import Transform from 'mediamonks-webgl/renderer/core/Transform';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Quaternion from 'mediamonks-webgl/renderer/math/Quaternion';
import MaterialInstance from './MaterialInstance';
import UnityModel from 'mediamonks-webgl/unity/UnityModel';

export interface KeyDrivenAttribute {
  update(time: number): void;
}

export class KeyDrivenFloat implements KeyDrivenAttribute {
  public keyframeTrack: KeyframeTrack;
  public material: MaterialInstance;
  public channel: number = 0;
  public name: string;

  constructor(
    material: MaterialInstance,
    name: string,
    channel: string,
    keyframeTrack: KeyframeTrack,
  ) {
    this.material = material;
    this.name = name;

    if (channel == 'y') {
      this.channel = 1;
    } else if (channel == 'z') {
      this.channel = 2;
    } else if (channel == 'w') {
      this.channel = 3;
    } else if (channel == 'r') {
      this.channel = 0;
    } else if (channel == 'g') {
      this.channel = 1;
    } else if (channel == 'b') {
      this.channel = 2;
    } else if (channel == 'a') {
      this.channel = 3;
    }

    this.keyframeTrack = keyframeTrack;
    // if(LogGL.ENABLED)console.log('KeyDrivenFloat', material.sharedMaterial.name, this.name, this.channel);
  }

  public update(time: number) {
    this.material.setFloat(this.name, this.channel, this.keyframeTrack.evaluate(time));
  }
}

export class KeyDrivenActive implements KeyDrivenAttribute {
  public model: UnityModel;
  public keyframeTrack: KeyframeTrack;

  constructor(model: UnityModel, keyframeTrack: KeyframeTrack) {
    this.model = model;
    this.keyframeTrack = keyframeTrack;
  }

  public update(time: number) {
    this.model.visible = this.keyframeTrack.evaluate(time) > 0.5;
  }
}

export class KeyDrivenTransform implements KeyDrivenAttribute {
  public transform: Transform;
  public keyframeTracks: KeyframeTrack[];
  public p: Vector3 = new Vector3();
  public s: Vector3 = new Vector3();
  public r: Quaternion = new Quaternion();

  constructor(transform: Transform, keyframeTracks: KeyframeTrack[]) {
    this.transform = transform;
    this.keyframeTracks = keyframeTracks;
  }

  public update(time: number) {
    let positionDirty: boolean = false;
    let scaleDirty: boolean = false;
    let rotationDirty: boolean = false;

    for (const track of this.keyframeTracks) {
      switch (track.type) {
        case TrackType.PositionX:
          this.p.x = track.evaluate(time);
          positionDirty = true;
          break;
        case TrackType.PositionY:
          this.p.y = track.evaluate(time);
          positionDirty = true;
          break;
        case TrackType.PositionZ:
          this.p.z = track.evaluate(time);
          positionDirty = true;
          break;
        case TrackType.RotationX:
          this.r.x = track.evaluate(time);
          rotationDirty = true;
          break;
        case TrackType.RotationY:
          this.r.y = track.evaluate(time);
          rotationDirty = true;
          break;
        case TrackType.RotationZ:
          this.r.z = track.evaluate(time);
          rotationDirty = true;
          break;
        case TrackType.RotationW:
          this.r.w = track.evaluate(time);
          rotationDirty = true;
          break;
        case TrackType.ScaleX:
          this.s.x = track.evaluate(time);
          scaleDirty = true;
          break;
        case TrackType.ScaleY:
          this.s.x = track.evaluate(time);
          scaleDirty = true;
          break;
        case TrackType.ScaleZ:
          this.s.x = track.evaluate(time);
          scaleDirty = true;
          break;
      }
    }
    if (positionDirty) this.transform.position = this.p;
    if (rotationDirty) this.transform.rotation = this.r.normalize();
    if (scaleDirty) this.transform.scale = this.s;
  }
}
