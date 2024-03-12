import M27CheckboxOption from 'app/component/molecule/m27-checkbox-option/M27CheckboxOption';
import { PresenceConstraint, ValidationType } from './Validation.types';

export interface FormFieldsetBase {
  legend?: { text: string; variant?: 'heading' };
  name: string;
  id: string;
  items: Array<FormField>;
  required?: boolean;
  validate?: PresenceConstraint;
}

export type FormField =
  | SelectItem
  | MultiselectFieldsetItem
  | RadioItem
  | CheckboxItem
  | TextItem
  | TextAreaItem
  | EmailItem
  | PasswordItem
  | PhoneItem;

export type FormFieldType =
  | 'radio'
  | 'checkbox'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'text'
  | 'textarea'
  | 'phone';

export interface Input {
  name: string;
  label: string;
  id: string;
  titleInEnglish: string;
  placeholder?: string;
  validate?: ValidationType;
  required?: boolean;
  wide?: boolean;
}

export interface RadioItem
  extends Omit<Input, 'placeholder' | 'titleInEnglish' | 'validate' | 'wide'> {
  type?: Extract<FormFieldType, 'radio'>;
  value: string;
}

export interface CheckboxItem extends Omit<RadioItem, 'type'> {
  type?: Extract<FormFieldType, 'checkbox'>;
}
export interface TextItem extends Input {
  type: Extract<FormFieldType, 'text'>;
}
export interface TextAreaItem extends Input {
  type: Extract<FormFieldType, 'textarea'>;
}
export interface EmailItem extends Input {
  type: Extract<FormFieldType, 'email'>;
}
export interface PasswordItem extends Input {
  type: Extract<FormFieldType, 'password'>;
}
export interface PhoneItem extends Input {
  type: Extract<FormFieldType, 'phone'>;
  countrySelector: { label: string; name: string; placeholder: string };
}
export interface SelectItem extends Input {
  type?: Extract<FormFieldType, 'select'>;
  items: Array<{ label: string; value: string }>;
}

export interface MultiselectFieldsetItem extends Omit<Input, 'name' | 'label'> {
  type?: Extract<FormFieldType, 'multiselect'>;
  items?: Array<M27CheckboxOption>;
  legend?: { text: string; variant?: 'heading' };
}
