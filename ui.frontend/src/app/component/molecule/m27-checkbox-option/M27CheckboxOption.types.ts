export type M27CheckboxOptionProps = {
  disabled?: boolean;
  checked?: boolean;
  id?: string;
  titleInEnglish?: string;
  name?: string;
  value?: string;
  required?: boolean;
  scrollComponent?: boolean;
} & (
  | {
      copy?: string;
      label?: never;
    }
  | {
      label?: string;
      copy?: never;
    }
);
