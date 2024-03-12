import { FormFieldSetIds } from 'app/data/type/FormStep.types';
import { FormFieldsetBase, TextAreaItem } from 'app/data/type/Form.types';

export type O74RadioListProps = {
  id?: string;
  scrollComponent?: boolean;
} & FormFieldSetRadioList;

export interface FormFieldSetRadioList extends FormFieldsetBase {
  type: Extract<FormFieldSetIds, 'radio'>;
  showTextareaForOtherChoice?: TextAreaItem;
}
