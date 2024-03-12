import { AbstractEvent } from 'seng-event';
import { EVENT_TYPE_PLACEHOLDER, generateEventTypes } from 'seng-event/lib/util/eventTypeUtils';
import { Collapsible } from './Collapsible';

class CollapsibleEvent extends AbstractEvent {
  public static EXPAND: string = EVENT_TYPE_PLACEHOLDER;
  public static COLLAPSE: string = EVENT_TYPE_PLACEHOLDER;
  public static UPDATE: string = EVENT_TYPE_PLACEHOLDER;
  public static UPDATE_COMPLETE: string = EVENT_TYPE_PLACEHOLDER;

  public readonly collapsible: Collapsible;

  constructor(
    type: string,
    collapsible: Collapsible,
    bubbles?: boolean,
    cancelable?: boolean,
    setTimeStamp?: boolean,
  ) {
    super(type, bubbles, cancelable, setTimeStamp);

    this.collapsible = collapsible;
  }

  public clone(): CollapsibleEvent {
    return new CollapsibleEvent(this.type, this.collapsible, this.bubbles, this.cancelable);
  }
}

generateEventTypes({ CollapsibleEvent });

export default CollapsibleEvent;
