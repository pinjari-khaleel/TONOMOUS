import KeyframeTrack from './KeyframeTrack';
import IWebGLDestructible from '../../renderer/core/IWebGLDestructible';

export class AnimationEvent {
  public time: number = 0;
  public name: string = 'unnamed event';
  private timeOld: number = 0;

  public static parseJSON(data: any): AnimationEvent {
    const animationEvent: AnimationEvent = new AnimationEvent();
    animationEvent.time = data.time;
    animationEvent.name = data.name;
    return animationEvent;
  }

  /* public update(time: number, callback: (e: string) => void) {
     if (this.timeOld < this.time && time >= this.time) {
       callback(this.name);
     }
     this.timeOld = time;
   }*/
}

export default class AnimationClip implements IWebGLDestructible {
  public id = -1;
  public duration = 0;
  public name = 'not set';
  public tracks: KeyframeTrack[];
  public events: AnimationEvent[];

  constructor(
    id: number,
    name: string,
    duration: number,
    tracks: KeyframeTrack[],
    events: AnimationEvent[],
  ) {
    this.id = id;
    this.duration = duration;
    this.name = name;
    this.tracks = tracks;
    this.events = events;
  }

  /* public update(time:number, callback: (eventName:string)=> void)
   {
     for(const event of this.events){
       event.update(time, callback);
     }
   }*/

  public getTracksByName(name: string): KeyframeTrack[] {
    return this.tracks.filter((track) => track.name === name);
  }

  public static parseJSON(data: any): AnimationClip {
    const tracks: KeyframeTrack[] = [];

    for (const track of data.tracks) {
      tracks.push(KeyframeTrack.parseJSON(track));
    }

    const events: AnimationEvent[] = [];
    if (data['events'] !== null) {
      for (const event of data['events']) {
        events.push(AnimationEvent.parseJSON(event));
      }
    }

    tracks.forEach((track) => (track.duration = data.duration));

    return new AnimationClip(data.id, data.name, data.duration, tracks, events);
  }

  public destruct() {
    if (this.tracks) {
      for (const track of this.tracks) {
        track.destruct();
      }
    }
  }
}
