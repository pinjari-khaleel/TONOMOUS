import { FormFieldSetIds } from 'app/data/type/FormStep.types';
import { FormFieldsetBase } from 'app/data/type/Form.types';

export type O77InputListProps = {
  id?: string;
  scrollComponent?: boolean;
} & FormFieldSetInputList;

export interface FormFieldSetInputList extends Omit<FormFieldsetBase, 'required' | 'validate'> {
  type: Extract<FormFieldSetIds, 'grid'>;
}
