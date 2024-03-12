import { LengthConstraint, PresenceConstraint } from 'app/data/type/Validation.types';

export type A16TextareaProps = {
  scrollComponent?: boolean;
  disabled?: boolean;
  id: string;
  name: string;
  maxlength?: number;
  minlength?: number;
  placeholder?: string;
  readonly?: string;
  titleInEnglish: string;
  validate?: LengthConstraint & PresenceConstraint;
  dataAttribute?: string;
};
