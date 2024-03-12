import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M06LinkProps from './M06Link.types';
import M06Data from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map((path) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

const flattenedDataDefaultExample = flattenProps(M06Data);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M06 Link',
  component: require('./M06Link'),
  argTypes: {
    ...flattenedPropsTypes,
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Specifies an icon. Leave blank for no icon',
    },
    variant: {
      control: { type: 'select', options: ['footerLink', 'checkbox', 'marginaliaLink'] },
      description: 'Specifies the label variant',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a link element',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>{{> m06-link }}</hbs>`,
});

export const Default = withMappedProps<M06LinkProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
