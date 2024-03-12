import { AbstractEvent } from 'seng-event';
import { EVENT_TYPE_PLACEHOLDER, generateEventTypes } from 'seng-event/lib/util/eventTypeUtils';

class CarouselEvent extends AbstractEvent {
  public static CHANGE: string = EVENT_TYPE_PLACEHOLDER;
  public static UPDATE: string = EVENT_TYPE_PLACEHOLDER;

  public data: { index: number; x?: number };

  constructor(
    type: string,
    data: { index: number; x?: number },
    bubbles?: boolean,
    cancelable?: boolean,
    setTimeStamp?: boolean,
  ) {
    super(type, bubbles, cancelable, setTimeStamp);
    this.data = data;
  }

  public clone(): CarouselEvent {
    return new CarouselEvent(this.type, this.data, this.bubbles, this.cancelable);
  }
}

generateEventTypes({ CarouselEvent });

export default CarouselEvent;
