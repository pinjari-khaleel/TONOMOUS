import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M31DefaultData from '../m31-dropdown-field/data/default.yaml';
import { M31DropdownFieldProps } from './M31DropdownField.types';

const flattenedDataDefaultExample = flattenProps(M31DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M31 Dropdown Field',
  component: require('./M31DropdownField'),
  argTypes: {
    ...flattenedPropsTypes,
    required: {
      control: { type: 'boolean' },
      description: 'Option is required if value is true.',
    },
    blockValidation: {
      control: { type: 'boolean' },
      description: 'Adds validation.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders dropdown.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m31-dropdown-field }}
  </hbs>`,
});

export const Default = withMappedProps<M31DropdownFieldProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
