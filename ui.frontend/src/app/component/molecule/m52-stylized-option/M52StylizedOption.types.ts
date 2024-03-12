import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import { CheckboxItem, RadioItem } from 'app/data/type/Form.types';

export type M52StylizedOptionProps<T extends CheckboxItem | RadioItem> = T & {
  image: A01ImageProps;
};
