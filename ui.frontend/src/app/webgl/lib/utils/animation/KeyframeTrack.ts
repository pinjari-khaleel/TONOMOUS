import Transform from 'mediamonks-webgl/renderer/core/Transform';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Quaternion from 'mediamonks-webgl/renderer/math/Quaternion';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';

export enum TrackType {
  PositionX = 'Position.x',
  PositionY = 'Position.y',
  PositionZ = 'Position.z',
  RotationX = 'Rotation.x',
  RotationY = 'Rotation.y',
  RotationZ = 'Rotation.z',
  RotationW = 'Rotation.w',
  ScaleX = 'Scale.x',
  ScaleY = 'Scale.y',
  ScaleZ = 'Scale.z',
}

export default class KeyframeTrack implements IWebGLDestructible {
  public name: string;
  public transformId: number;
  public type: string;
  public times: Float32Array;
  public values: Float32Array;
  public duration: number = -1;
  //temp
  private _lastIndex: number = 0;
  private _lastTime: number = -10;
  private _lastValue: number = 0;

  constructor(
    name: string,
    transformId: number | null,
    type: string,
    times: Float32Array,
    values: Float32Array,
  ) {
    this.name = name;
    this.transformId = transformId ? transformId : 0;
    this.type = type;
    this.times = times;
    this.values = values;
  }

  public getIsEmpty(): boolean {
    let l = this.values.length;
    if (l < 2) return true;
    //per channel
    for (let j: number = 1; j < l; ++j) {
      if (this.values[j - 1] != this.values[j]) return false;
    }
    return true;
  }

  public evaluate(time: number): number {
    if (time === this._lastTime) return this._lastValue;

    if (this.values.length === 0) return 0;
    if (this.values.length === 1) return this.values[0];
    if (time === 0 || time < this.times[0]) return this.values[0];
    const n = this.times.length - 1;
    if (time >= this.times[n]) return this.values[n];

    let startI = time >= this._lastTime ? this._lastIndex : 0;
    this._lastTime = time;

    for (let i = startI; i < n; i++) {
      const l = this.times[i];
      const h = this.times[i + 1];

      if (time >= l && time <= h) {
        this._lastIndex = i;
        const ratio = (time - l) / (h - l);
        return (this._lastValue = Utils.lerp(this.values[i], this.values[i + 1], ratio));
      }
    }
    return 0;
  }

  public static parseJSON(data: any): KeyframeTrack {
    return new KeyframeTrack(data.name, data.transformId, data.type, data.times, data.values);
  }

  public destruct(): void {}
}

export class TransformTrack {
  public transform: Transform;
  private readonly p: Vector3;
  private readonly r: Quaternion;
  private readonly s: Vector3;
  private readonly animatePosition: boolean = false;
  private readonly animateRotation: boolean = false;
  private readonly animateScale: boolean = false;
  private readonly tracks: KeyframeTrack[];

  constructor(transform: Transform, tracks: KeyframeTrack[]) {
    this.transform = transform;
    for (const track of tracks) {
      if (
        track.type == TrackType.PositionX ||
        track.type == TrackType.PositionY ||
        track.type == TrackType.PositionZ
      )
        this.animatePosition = true;
      if (
        track.type == TrackType.RotationX ||
        track.type == TrackType.RotationY ||
        track.type == TrackType.RotationZ ||
        track.type == TrackType.RotationW
      )
        this.animateRotation = true;
      if (
        track.type == TrackType.ScaleX ||
        track.type == TrackType.ScaleY ||
        track.type == TrackType.ScaleZ
      )
        this.animateScale = true;
    }

    this.p = transform.position;
    this.r = transform.rotation;
    this.s = transform.scale;

    this.tracks = tracks;
  }

  public update(t: number) {
    for (const track of this.tracks) {
      switch (track.type) {
        case TrackType.PositionX:
          this.p.x = track.evaluate(t);
          break;
        case TrackType.PositionY:
          this.p.y = track.evaluate(t);
          break;
        case TrackType.PositionZ:
          this.p.z = track.evaluate(t);
          break;
        case TrackType.RotationX:
          this.r.x = track.evaluate(t);
          break;
        case TrackType.RotationY:
          this.r.y = track.evaluate(t);
          break;
        case TrackType.RotationZ:
          this.r.z = track.evaluate(t);
          break;
        case TrackType.RotationW:
          this.r.w = track.evaluate(t);
          break;
        case TrackType.ScaleX:
          this.s.x = track.evaluate(t);
          break;
        case TrackType.ScaleY:
          this.s.y = track.evaluate(t);
          break;
        case TrackType.ScaleZ:
          this.s.z = track.evaluate(t);
          break;
      }
    }

    if (this.animatePosition) this.transform.position = this.p;
    if (this.animateRotation) this.transform.rotation = this.r.normalize();
    if (this.animateScale) this.transform.scale = this.s;
  }
}
