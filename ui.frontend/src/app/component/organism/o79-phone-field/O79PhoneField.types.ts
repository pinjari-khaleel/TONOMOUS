import { M30TextFieldProps } from 'app/component/molecule/m30-text-field/M30TextField.types';
import { M41CountryDropdownProps } from 'app/component/molecule/m41-country-dropdown/M41CountryDropdown.types';

export type O79PhoneFieldProps = {
  id?: string;
  countryDropdown: M41CountryDropdownProps;
} & M30TextFieldProps;
