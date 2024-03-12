import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M49MultipleCopyProps } from './M49MultipleCopy.types';
import M49DefaultData from './data/default.yaml';
import M49ExampleData from './data/example.yaml';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M49DefaultData);
const flattenedDataExample = flattenProps(M49ExampleData);
const flattenedArgTypes = [flattenedDataDefaultExample, flattenedDataExample].reduce(
  (flattenedArgTypes, data) => {
    const argTypes = getFlatPropTypes(data);

    return { ...flattenedArgTypes, ...argTypes };
  },
  {} as ArgTypes,
);
const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map((path) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  title: 'NEOM/molecule/M49 Multiple Copy',
  component: require('./M49MultipleCopy'),
  argTypes: {
    ...flattenedArgTypes,
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Specifies an icon.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders multiple copy with/without icon.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m49-multiple-copy }}
  </hbs>`,
});

export const Default = withMappedProps<M49MultipleCopyProps>(DefaultTemplate);
export const Example = withMappedProps<M49MultipleCopyProps>(DefaultTemplate);

Default.args = flattenedDataDefaultExample;
Example.args = flattenedDataExample;
