import { ValidationType } from 'app/data/type/Validation.types';

export type M30TextFieldProps = {
  disabled?: boolean;
  id: string;
  label: string;
  maxlength?: number;
  messages?: {
    error?: string;
    help?: string;
  };
  name: string;
  pattern?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  type: 'text' | 'password' | 'email' | 'number' | 'tel';
  validate?: ValidationType;
  value?: string;
  blockValidation?: boolean;
};
