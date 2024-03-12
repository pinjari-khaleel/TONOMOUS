import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M41CountryDropdownProps } from './M41CountryDropdown.types';
import M41DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M41DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M41 Country Dropdown',
  component: require('./M41CountryDropdown'),
  argTypes: {
    ...flattenedPropsTypes,
    showRawValue: {
      control: { type: 'boolean' },
      description: 'Shows both label and value if true.',
    },
    isWideDropdown: {
      control: { type: 'boolean' },
      description: 'Specifies size of the dropdown.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders dropdown list.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m41-country-dropdown }}
  </hbs>`,
});

export const Default = withMappedProps<M41CountryDropdownProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
