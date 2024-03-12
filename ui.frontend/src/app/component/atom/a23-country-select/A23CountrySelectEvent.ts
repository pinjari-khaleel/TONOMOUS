import { AbstractEvent } from 'seng-event';
import A23CountrySelect from './A23CountrySelect';

export default class A23CountrySelectEvent extends AbstractEvent {
  public static UPDATE: string = 'update';

  public readonly countrySelect: A23CountrySelect;

  constructor(
    type: string,
    countrySelect: A23CountrySelect,
    bubbles?: boolean,
    cancelable?: boolean,
  ) {
    super(type, bubbles, cancelable);

    this.countrySelect = countrySelect;
  }
  clone(): A23CountrySelectEvent {
    return new A23CountrySelectEvent(this.type, this.countrySelect, this.bubbles, this.cancelable);
  }
}
