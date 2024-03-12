import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import O77InputList from './O77InputList';
import { O77InputListProps } from './O77InputList.types';
import data from './data/default.yaml';

const flattenedProps = flattenProps(data);

const argTypes = Object.keys(flattenedProps).reduce((argTypes, flatPropKey) => {
  if (!flatPropKey.includes('required') && !flatPropKey.includes('wide')) {
    return { ...argTypes, [flatPropKey]: { control: { type: 'text' } } };
  } else {
    return { ...argTypes, [flatPropKey]: { control: { type: 'boolean' } } };
  }
}, {});

export default {
  component: O77InputList,
  title: `NEOM/organism/O77InputList`,
  argTypes: argTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Renders a input list fieldset that allows for every type of input in our component library.',
      },
    },
  },
} as Meta;

const Template = () => ({
  template: `<hbs>{{> o77-input-list }}</hbs>`,
});

export const Default = withMappedProps<O77InputListProps>(Template);
Default.args = flattenedProps;
