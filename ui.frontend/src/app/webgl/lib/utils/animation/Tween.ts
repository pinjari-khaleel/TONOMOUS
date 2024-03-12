//
// Note: you have to call Tween.update in your own update loop!
// Declare the type of a tween variable by (default type is number):
//
//    private myTween = new Tween(new Vector2(0,0));
// or
//    private myTween: Tween<Vector2>;
//

// @ts-nocheck

import Vector2 from 'mediamonks-webgl/renderer/math/Vector2';
import Quaternion from 'mediamonks-webgl/renderer/math/Quaternion';
import Vector4 from 'mediamonks-webgl/renderer/math/Vector4';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Ease01 from 'mediamonks-webgl/utils/math/Ease01';
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';

export default class Tween<T = number> {
  private goal!: T;
  private currentValue!: T;
  private duration: number = 0;
  private _progress: number = 1;
  private easing: (t: number) => number = Ease01.smoothstep;
  private animateCallback: ((v: T) => void) | undefined = undefined;
  private completeCallback: (() => void) | undefined = undefined;

  private clone!: (v: T) => T;
  private lerp!: (a: T, b: T, t: number) => T;
  private _from;

  constructor(_from?: T) {
    this._from = _from;
    this.from = _from;
  }

  private set from(value: T) {
    if (value !== undefined) {
      if (this.clone === undefined) {
        this.clone = (v: T) => v.clone();
        if (typeof value === 'number') {
          this.clone = (v: T) => v;
          this.lerp = Utils.lerp;
        } else if (value instanceof Vector2) {
          this.lerp = Vector2.lerp;
        } else if (value instanceof Vector3) {
          this.lerp = Vector3.lerp;
        } else if (value instanceof Vector4) {
          this.lerp = Vector4.lerp;
        } else if (value instanceof Quaternion) {
          this.lerp = Quaternion.slerp;
        }
      }
      this._from = this.clone(value);
      this.currentValue = this.clone(value);
    }
  }

  public get from(): T {
    return this._from;
  }

  public to(
    goal: T,
    durationSeconds: number,
    animateCallback: ((v: T) => void) | undefined = undefined,
    completeCallback: (() => void) | undefined = undefined,
    easing: (t: number) => number = Ease01.smoothstep,
  ): Tween<T> {
    if (this.from === undefined) {
      LogGL.error('Tween.to without setting from value');
    }
    this.from = this.currentValue;
    this.goal = this.clone(goal);

    this.duration = durationSeconds;
    this._progress = 0;

    this.animateCallback = animateCallback;
    this.completeCallback = completeCallback;
    this.easing = easing;

    return this;
  }

  public fromTo(
    value: T,
    goal: T,
    durationSeconds: number,
    animateCallback: ((v: T) => void) | undefined = undefined,
    completeCallback: (() => void) | undefined = undefined,
    easing: (t: number) => number = Ease01.smoothstep,
  ): Tween<T> {
    this.from = value;
    return this.to(goal, durationSeconds, animateCallback, completeCallback, easing);
  }

  public stop(): Tween<T> {
    return this.cancel();
  }

  public cancel(): Tween<T> {
    this._progress = 1;
    this.animateCallback = undefined;
    this.completeCallback = undefined;
    return this;
  }

  public get completed(): boolean {
    return this.progress >= 1;
  }

  public get progress(): number {
    return this._progress;
  }

  public get value(): T {
    return this.currentValue;
  }

  public update(dt: number) {
    if (this._progress < 1) {
      this._progress = this.duration <= 0 ? 1 : Utils.clamp01(this._progress + dt / this.duration);
      this.currentValue = this.lerp(
        this.from,
        this.goal,
        Utils.clamp01(this.easing(this._progress)),
      );

      if (this.animateCallback !== undefined) {
        this.animateCallback(this.value);
      }
      if (this._progress >= 1 && this.completeCallback) {
        this.completeCallback();
      }
    }
  }
}
