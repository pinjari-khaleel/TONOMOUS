import EventDispatcher from 'seng-event/lib/EventDispatcher';
import { AbstractEvent } from 'seng-event';
import { EVENT_TYPE_PLACEHOLDER, generateEventTypes } from 'seng-event/lib/util/eventTypeUtils';

type CountdownOptions = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default class CountdownTimer extends EventDispatcher {
  public readonly estimatedDate: string;
  public readonly daysToHours?: boolean;
  public options: CountdownOptions = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  private countdownInterval: any;

  constructor(estimatedDate: string, daysToHours?: boolean) {
    super();

    this.estimatedDate = estimatedDate;
    this.daysToHours = daysToHours;
    this.startCountdown();
  }

  public startCountdown() {
    let countdownDate: any = new Date(this.estimatedDate).getTime();

    if (isNaN(countdownDate)) {
      throw new Error('countdown date is wrong');
    }

    this.countdownInterval = setInterval(() => {
      let currentDate: any = new Date().getTime();
      const distance = countdownDate - currentDate;

      if (distance < 0) {
        clearInterval(this.countdownInterval);
        this.dispatchEvent(new CountdownEvent(CountdownEvent.COMPLETE));
        return;
      }

      this.options.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.options.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.options.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.options.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (this.daysToHours) this.options.hours = this.options.hours + this.options.days * 24;

      this.dispatchEvent(new CountdownEvent(CountdownEvent.UPDATE));
    }, 200);
  }

  public dispose() {
    clearInterval(this.countdownInterval);
    super.dispose();
  }
}

export class CountdownEvent extends AbstractEvent {
  public static UPDATE: string = EVENT_TYPE_PLACEHOLDER;
  public static COMPLETE: string = EVENT_TYPE_PLACEHOLDER;

  constructor(type: string, bubbles?: boolean, cancelable?: boolean, setTimeStamp?: boolean) {
    super(type, bubbles, cancelable, setTimeStamp);
  }

  public clone(): CountdownEvent {
    return new CountdownEvent(this.type, this.bubbles, this.cancelable);
  }
}

generateEventTypes({ CountdownEvent });
