import { AbstractEvent } from 'seng-event';
import O45Form from './O45Form';

export default class O45FormEvent extends AbstractEvent {
  public static UPDATE: string = 'update';

  public readonly form: O45Form;

  constructor(type: string, form: O45Form) {
    super(type);

    this.form = form;
  }
  clone(): O45FormEvent {
    return new O45FormEvent(this.type, this.form);
  }
}
