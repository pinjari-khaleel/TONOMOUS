import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M32ShareButtonProps } from './M32ShareButton.types';
import M32DefaultData from './data/example.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M32DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map((path) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  title: 'NEOM/molecule/M32 Share Button',
  component: require('./M32ShareButton'),
  argTypes: {
    ...flattenedPropsTypes,
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Icon on the button.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders share button.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m32-share-button }}
  </hbs>`,
});

export const Default = withMappedProps<M32ShareButtonProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
