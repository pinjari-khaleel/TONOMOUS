import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M14ToggleButtonProps from './M14ToggleButton.types';
import M14DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M14DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M14 Toggle Button',
  component: require('./M14ToggleButton'),
  argTypes: {
    ...flattenedPropsTypes,
    variant: {
      control: { type: 'select', options: ['none', 'accordion'] },
      description: 'Specifies the variant',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a toggle button element',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
  <div>
    {{> m14-toggle-button }}
  </div>
</hbs>`,
});

export const Default = withMappedProps<M14ToggleButtonProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
