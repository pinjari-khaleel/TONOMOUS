import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M34ComponentBackgroundProps } from './M34ComponentBackground.types';
import M34DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M34DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M34 Component Background',
  component: require('./M34ComponentBackground'),
  argTypes: {
    ...flattenedPropsTypes,
    mask: {
      control: { type: 'object' },
      description: 'Changes opacity and solidity of the background.',
    },
    sticky: {
      control: { type: 'boolean' },
      description: 'Makes sticky if true.',
    },
    image: {
      control: { type: 'object' },
      description: 'A01 Image component.',
    },
    video: {
      control: { type: 'object' },
      description: 'A19 Video component.',
    },
    lottie: {
      control: { type: 'object' },
      description: 'A20 Lottie Animation component.',
    },
    effect: {
      control: { type: 'object' },
      description: 'Image effect.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders the background with image/video/animation.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m34-component-background }}
  </hbs>`,
});

export const Default = withMappedProps<M34ComponentBackgroundProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
