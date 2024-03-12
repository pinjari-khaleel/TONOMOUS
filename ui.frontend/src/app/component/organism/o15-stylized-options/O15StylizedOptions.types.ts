import { M52StylizedOptionProps } from 'app/component/molecule/m52-stylized-option/M52StylizedOption.types';
import {
  CheckboxItem,
  FormFieldsetBase,
  MultiselectFieldsetItem,
  RadioItem,
  SelectItem,
  TextAreaItem,
} from 'app/data/type/Form.types';

export type O15StylizedOptionsProps = {
  id?: string;
} & FormFieldSetStylizedOptions;

export type FormFieldSetStylizedCheckboxId = 'checkboxStylized';
export type FormFieldSetStylizedRadioId = 'radioStylized';

export type FormFieldSetStylizedOptions = (
  | {
      type: FormFieldSetStylizedCheckboxId;
      items?: Array<M52StylizedOptionProps<CheckboxItem>>;
      showTextareaForOtherChoice?: TextAreaItem;
      showDropdownForMultipleChoice?: MultiSelectProps | SelectProps;
    }
  | {
      type: FormFieldSetStylizedRadioId;
      items: Array<M52StylizedOptionProps<RadioItem>>;
      showTextareaForOtherChoice?: TextAreaItem;
    }
) &
  Omit<FormFieldsetBase, 'items'>;

export type MultiSelectProps = {
  multiselect: true;
} & MultiselectFieldsetItem;

export type SelectProps = {
  multiselect: false;
} & SelectItem;
