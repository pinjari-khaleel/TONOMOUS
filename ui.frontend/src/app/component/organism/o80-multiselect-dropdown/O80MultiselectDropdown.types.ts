import { M27CheckboxOptionProps } from 'app/component/molecule/m27-checkbox-option/M27CheckboxOption.types';
import { PresenceConstraint } from 'app/data/type/Validation.types';

export type O80MultiselectDropdownProps = {
  scrollComponent?: boolean;
  legend?: string;
  id: string;
  titleInEnglish?: string;
  placeholder?: string;
  required?: boolean;
  validate?: PresenceConstraint;
  items?: Array<M27CheckboxOptionProps>;
};
