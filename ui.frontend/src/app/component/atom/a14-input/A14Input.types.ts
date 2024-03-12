import { ValidationType } from 'app/data/type/Validation.types';

export type A14InputProps = {
  checked?: boolean;
  disabled?: boolean;
  id: string;
  name: string;
  pattern?: string;
  placeholder?: string;
  readonly?: boolean;
  titleInEnglish: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'hidden' | 'search';
  validate?: ValidationType;
  value?: string;
};
