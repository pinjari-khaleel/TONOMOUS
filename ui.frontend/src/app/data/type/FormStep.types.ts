import M04ComponentHeaderProps from 'app/component/molecule/m04-component-header/M04ComponentHeader.types';
import {
  FormFieldSetStylizedCheckboxId,
  FormFieldSetStylizedOptions,
  FormFieldSetStylizedRadioId,
} from 'app/component/organism/o15-stylized-options/O15StylizedOptions.types';
import { FormFieldSetRadioList } from 'app/component/organism/o74-radio-list/O74RadioList.types';
import { FormFieldSetCheckboxList } from 'app/component/organism/o75-checkbox-list/O75CheckboxList.types';
import { FormFieldSetRadioGroup } from 'app/component/organism/o76-radio-group/O76RadioGroup.types';
import { FormFieldSetInputList } from 'app/component/organism/o77-input-list/O77InputList.types';

export type FormStepProps = {
  id?: string;
  scrollComponent?: boolean;
  step: number;
  header: M04ComponentHeaderProps;
  groups: Array<FormFieldSet>;
  recaptchaStatement: string;
};

export type FormFieldSet =
  | FormFieldSetInputList
  | FormFieldSetRadioGroup
  | FormFieldSetRadioList
  | FormFieldSetCheckboxList
  | FormFieldSetStylizedOptions;

export type FormFieldSetIds =
  | 'grid'
  | 'radioGroup'
  | 'radio'
  | 'checkbox'
  | FormFieldSetStylizedRadioId
  | FormFieldSetStylizedCheckboxId;
