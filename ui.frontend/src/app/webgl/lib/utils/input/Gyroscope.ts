import Quaternion from '../../renderer/math/Quaternion';
import bowser from 'bowser';
import LogGL from 'mediamonks-webgl/renderer/core/LogGL';
// import {isIpadOS, isTouch} from "../../../../util/deviceUtil";
import Utils from 'mediamonks-webgl/renderer/core/Utils';
import IWebGLDestructible from 'mediamonks-webgl/renderer/core/IWebGLDestructible';

export default class Gyroscope implements IWebGLDestructible {
  private enabled: boolean = false;
  private isDeviceAvailable: boolean = false;
  private eventBind: boolean = false;
  private target: Quaternion = new Quaternion();
  private screen: Quaternion = new Quaternion();
  private worldRot: Quaternion = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

  constructor() {
    // @ts-ignore
    if (bowser.ios && typeof DeviceMotionEvent.requestPermission === 'function') {
      // if ((bowser.ios || isIpadOS()) && typeof DeviceMotionEvent.requestPermission === 'function') {
      let requested = false;
      window.addEventListener('click', () => {
        if (LogGL.ENABLED) console.log('Gyroscope: handle click');
        if (requested) {
          return;
        }
        requested = true;
        // @ts-ignore
        DeviceOrientationEvent.requestPermission()
          .then((response: any) => {
            if (LogGL.ENABLED) console.log('Gyroscope: requestPermission', response);
            if (response == 'granted') {
              this.enable();
            }
          })
          .catch((response: any) => {});
      });
    } else {
      this.enable();
    }
  }

  public enable(): void {
    if ('ondeviceorientation' in window) {
      if (LogGL.ENABLED) console.log('Gyroscope: ondeviceorientation found on window');
      this.isDeviceAvailable = true;
    } else {
      console.warn('Gyroscope: no ondeviceorientation in window');
    }

    if (this.isDeviceAvailable) {
      if (!this.eventBind) {
        if (LogGL.ENABLED) console.log('Gyroscope: addEventListener : deviceorientation');
        window.addEventListener(
          'deviceorientation',
          (e) => {
            this.handleDeviceOrientation(e);
          },
          false,
        );
        this.eventBind = true;
      }

      this.enabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.enabled && this.isDeviceAvailable;
  }

  public disable(): void {
    this.enabled = false;
  }

  private handleDeviceOrientation(event: DeviceOrientationEvent) {
    if (this.enabled) {
      const screenOrientation = window.orientation || 0;

      this.target.identity();
      this.target.rotateY(Utils.degToRad(<number>event['alpha']));
      this.target.rotateX(Utils.degToRad(<number>event['beta']));
      this.target.rotateZ(-Utils.degToRad(<number>event['gamma']));

      const minusHalfAngle = ((-screenOrientation / 2) * Math.PI) / 180;
      this.screen.setValues(0, Math.sin(minusHalfAngle), 0, Math.cos(minusHalfAngle));

      this.target.multiply(this.screen);
      this.target.multiply(this.worldRot);
    }
  }

  public get rotation(): Quaternion {
    return this.target.clone();
  }

  public destruct() {}
}
