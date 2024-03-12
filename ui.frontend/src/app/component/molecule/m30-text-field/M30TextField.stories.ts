import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { M30TextFieldProps } from './M30TextField.types';
import M30DefaultData from '../m30-text-field/data/default.yaml';
import M30ReadonlyData from '../m30-text-field/data/readonly.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';

const flattenedDefaultData = flattenProps(M30DefaultData);
const flattenedReadonlyData = flattenProps(M30ReadonlyData);

const flattenedArgTypes = [flattenedDefaultData, flattenedReadonlyData].reduce(
  (flattenedArgTypes, data) => {
    const argTypes = getFlatPropTypes(data);

    return { ...flattenedArgTypes, ...argTypes };
  },
  {} as ArgTypes,
);

export default {
  title: 'NEOM/molecule/M30 Text Field',
  component: require('./M30TextField'),
  argTypes: {
    ...flattenedArgTypes,
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable input field.',
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Max number of characters.',
    },
    type: {
      control: { type: 'select', options: ['text', 'password', 'email', 'number', 'tel'] },
      description: 'Type of input.',
    },
    blockValidation: {
      control: { type: 'boolean' },
      description: 'Adds validation for textarea.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an input field.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m30-text-field }}
  </hbs>`,
});

export const Default = withMappedProps<M30TextFieldProps>(DefaultTemplate);
export const Readonly = withMappedProps<M30TextFieldProps>(DefaultTemplate);

Default.args = flattenedDefaultData;
Readonly.args = flattenedReadonlyData;
