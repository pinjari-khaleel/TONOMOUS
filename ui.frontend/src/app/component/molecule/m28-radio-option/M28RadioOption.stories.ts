import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M28RadioOptionProps } from './M28RadioOption.types';
import M28DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps<M28RadioOptionProps>(M28DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M28 Radio Option',
  component: require('./M28RadioOption'),
  argTypes: {
    ...flattenedPropsTypes,
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable radio.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a radio option for form.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m28-radio-option }}
  </hbs>`,
});

export const Default = withMappedProps<M28RadioOptionProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
