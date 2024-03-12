import { FormFieldSetIds } from 'app/data/type/FormStep.types';
import { FormFieldsetBase, TextAreaItem } from 'app/data/type/Form.types';

export type O76RadioGroupProps = {
  id?: string;
  scrollComponent?: boolean;
};

export interface FormFieldSetRadioGroup extends FormFieldsetBase {
  type: Extract<FormFieldSetIds, 'radioGroup'>;
  showTextareaForOtherChoice?: TextAreaItem;
  copy: string;
}
