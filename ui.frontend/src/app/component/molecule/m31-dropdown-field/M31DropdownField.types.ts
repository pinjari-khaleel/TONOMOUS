import { PresenceConstraint } from 'app/data/type/Validation.types';

export type M31DropdownFieldProps = {
  id?: string;
  items: Array<{
    label: string;
    selected?: boolean;
    value: string;
  }>;
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  scrollComponent?: boolean;
  validate?: PresenceConstraint;
  blockValidation?: boolean;
};
