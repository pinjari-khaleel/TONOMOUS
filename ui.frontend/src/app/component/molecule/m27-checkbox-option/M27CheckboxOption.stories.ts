import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { M27CheckboxOptionProps } from './M27CheckboxOption.types';
import M27Data from '../m27-checkbox-option/data/default.yaml';
import M27CheckedData from '../m27-checkbox-option/data/checked.yaml';
import M27DisabledData from '../m27-checkbox-option/data/disabled.yaml';
import M27DisabledCheckedData from '../m27-checkbox-option/data/disabled-checked.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';

const flattenedDefaultData = flattenProps(M27Data);
const flattenedCheckedData = flattenProps(M27CheckedData);
const flattenedDisabledData = flattenProps(M27DisabledData);
const flattenedDisabledCheckedData = flattenProps(M27DisabledCheckedData);

const flattenedArgTypes = [
  flattenedDefaultData,
  flattenedCheckedData,
  flattenedDisabledData,
  flattenedDisabledCheckedData,
].reduce((flattenedArgTypes, data) => {
  const argTypes = getFlatPropTypes(data);

  return { ...flattenedArgTypes, ...argTypes };
}, {} as ArgTypes);

export default {
  title: 'NEOM/molecule/M27 Checkbox Option',
  component: require('./M27CheckboxOption'),
  argTypes: {
    ...flattenedArgTypes,
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable checkbox.',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Check checkbox.',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Makes checkbox field required.',
    },
    copy: {
      control: { type: 'text' },
      description: 'Copy of checkbox.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders checkbox.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m27-checkbox-option }}
  </hbs>`,
});

export const Default = withMappedProps<M27CheckboxOptionProps>(DefaultTemplate);
export const Checked = withMappedProps<M27CheckboxOptionProps>(DefaultTemplate);
export const Disabled = withMappedProps<M27CheckboxOptionProps>(DefaultTemplate);
export const DisabledChecked = withMappedProps<M27CheckboxOptionProps>(DefaultTemplate);

Default.args = flattenedDefaultData;
Checked.args = flattenedCheckedData;
Disabled.args = flattenedDisabledData;
DisabledChecked.args = flattenedDisabledCheckedData;
