import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import O74RadioList from './O74RadioList';
import { O74RadioListProps } from './O74RadioList.types';
import data from './data/default.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';

const flattenedProps = flattenProps(data);

const argTypes = Object.keys(flattenedProps).reduce((argTypes, flatPropKey) => {
  if (!flatPropKey.includes('required') && !flatPropKey.includes('wide')) {
    return { ...argTypes, [flatPropKey]: { control: { type: 'text' } } };
  } else {
    return { ...argTypes, [flatPropKey]: { control: { type: 'boolean' } } };
  }
}, {});

export default {
  component: O74RadioList,
  title: `NEOM/organism/O74RadioList`,
  argTypes: argTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders a radio list fieldset.',
      },
    },
  },
} as Meta;

const Template = () => ({
  template: `<hbs>{{> o74-radio-list }}</hbs>`,
});

export const Default = withMappedProps<O74RadioListProps>(Template);
Default.args = flattenedProps;
