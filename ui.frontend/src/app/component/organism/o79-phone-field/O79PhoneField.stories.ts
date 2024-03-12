import O79PhoneField from './O79PhoneField';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import data from './data/default.yaml';
import { O79PhoneFieldProps } from './O79PhoneField.types';

const flattenedProps = flattenProps(data);
const booleanArgTypes = ['showRawValue', 'isWideDropdown', 'required'];

const argTypes = Object.keys(flattenedProps).reduce((argTypes, flatPropKey) => {
  if (booleanArgTypes.find((key) => flatPropKey.includes(key))) {
    return { ...argTypes, [flatPropKey]: { control: { type: 'boolean' } } };
  } else {
    return { ...argTypes, [flatPropKey]: { control: { type: 'text' } } };
  }
}, {});

export default {
  component: O79PhoneField,
  title: `NEOM/organism/O79PhoneField`,
  argTypes: argTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders a phone field with a country selector for phone country codes.',
      },
    },
  },
};

const Template = () => ({
  template: `<hbs>{{> o79-phone-field }}</hbs>`,
});

export const Default = withMappedProps<O79PhoneFieldProps>(Template);
Default.args = flattenedProps;
