import OrbitCamera from 'mediamonks-webgl/utils/camera/OrbitCamera';
import Vector3 from 'mediamonks-webgl/renderer/math/Vector3';
import Camera from 'mediamonks-webgl/renderer/camera/Camera';
import Quaternion from 'mediamonks-webgl/renderer/math/Quaternion';
import Ease01 from 'mediamonks-webgl/utils/math/Ease01';
import Time from 'mediamonks-webgl/renderer/core/Time';
import Tween from 'mediamonks-webgl/utils/animation/Tween';

export default class AnimatedOrbitCamera extends OrbitCamera {
  private tmpCamera: Camera = new Camera();

  private distanceTween: Tween<number> = new Tween(0);
  private positionTween: Tween<Vector3> = new Tween(new Vector3());
  private rotationTween: Tween<Quaternion> = new Tween(new Quaternion());

  public update(userInput: boolean = true): void {
    super.update(this.animating || !userInput);

    if (this.animating) {
      const dt = Time.instance.deltaTime;

      this.rotationTween.update(dt);
      this.positionTween.update(dt);
      this.distanceTween.update(dt);

      this.pivot.position = this.positionTween.value;
      this.pivot.rotation = this.rotationTween.value;
      this.distance = this.distanceTween.value;
    }
  }

  public animateLookat(
    pos: Vector3,
    target: Vector3,
    duration: number,
    onComplete: (() => void) | null = null,
    onProgress: ((p: number) => void) | null = null,
    ease: (t: number) => number = Ease01.smootherstep,
    easeRotation: ((t: number) => number) | null = null,
  ) {
    this.tmpCamera.lookAt(pos, target);
    this.animatePosDistanceRotation(
      target,
      Vector3.distance(pos, target),
      this.tmpCamera.view.transform.rotation,
      duration,
      onComplete,
      onProgress,
      ease,
      easeRotation,
    );
  }

  public animatePosDistanceEuler(
    pos: Vector3,
    distance: number,
    euler: Vector3,
    duration: number,
    onComplete: (() => void) | null = null,
    onProgress: ((p: number) => void) | null = null,
    ease: (t: number) => number = Ease01.smootherstep,
    easeRotation: ((t: number) => number) | null = null,
  ) {
    this.tmpCamera.view.transform.euler = euler;
    this.animatePosDistanceRotation(
      pos,
      distance,
      this.tmpCamera.view.transform.rotation,
      duration,
      onComplete,
      onProgress,
      ease,
      easeRotation,
    );
  }

  public animatePosDistanceRotation(
    pos: Vector3,
    distance: number,
    rotation: Quaternion,
    duration: number,
    onComplete: (() => void) | null = null,
    onProgress: ((p: number) => void) | null = null,
    ease: (t: number) => number = Ease01.smootherstep,
    easeRotation: ((t: number) => number) | null = null,
  ) {
    this.distanceTween.fromTo(
      this.distance,
      distance,
      duration,
      () => {
        if (onProgress) {
          onProgress(this.progress);
        }
      },
      () => {
        this._rotationController.rotation = this.rotationTween.value;
        if (onComplete) {
          onComplete();
        }
      },
      ease,
    );
    this.rotationTween.fromTo(
      this.pivot.rotation,
      rotation,
      duration,
      undefined,
      undefined,
      easeRotation ? easeRotation : ease,
    );
    this.positionTween.fromTo(this.pivot.worldPosition, pos, duration, undefined, undefined, ease);
  }

  public get animating(): boolean {
    return !this.distanceTween.completed;
  }

  public get progress(): number {
    return this.distanceTween.progress;
  }
}
