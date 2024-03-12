import Utils from '../../renderer/core/Utils';

export default class Time {
  private static _instance: Time;

  public deltaTime: number;
  public fps: number;
  public averageFps: number = 60;
  public time: number;

  private manualUpdate: boolean = false;

  constructor() {
    if (Time._instance) {
      alert('do not create additional instances of the time class');
    }
    this.fps = 60;
    this.deltaTime = 1 / this.fps;
    this.time = 0;

    this.update();
  }

  public static get instance(): Time {
    if (!Time._instance) {
      Time._instance = new Time();
    }
    return Time._instance;
  }

  public updateManual() {
    this.manualUpdate = true;
    this.updateDeltaTime();
  }

  private update() {
    if (this.manualUpdate) {
      return;
    }
    window.requestAnimationFrame((t: number) => this.update());
    this.updateDeltaTime();
  }

  private updateDeltaTime(): void {
    const time = performance.now();
    this.deltaTime = time * 0.001 - this.time;
    if (this.deltaTime > 1 / 20) {
      this.deltaTime = 1 / 20;
    }
    if (this.deltaTime === 0) {
      this.deltaTime = 1 / 60;
    }

    this.time = time * 0.001;
    this.fps = 1 / this.deltaTime;

    if (this.averageFps > 0) {
      this.averageFps = Utils.lerp(this.fps, this.averageFps, 0.95);
    } else {
      this.averageFps = 1 / 60;
    }
  }

  public testPerformance(func: () => any): void {
    console.time('timer0');
    func();
    console.timeEnd('timer0');
  }
}
