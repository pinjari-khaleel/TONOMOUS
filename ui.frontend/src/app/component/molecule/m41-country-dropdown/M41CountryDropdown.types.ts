import { A23CountrySelectProps } from '../../atom/a23-country-select/A23CountrySelect.types';
import { A15SelectProps } from '../../atom/a15-select/A15Select.types';

export type M41CountryDropdownProps = A15SelectProps &
  A23CountrySelectProps & {
    id?: string;
    label: string;
  };
