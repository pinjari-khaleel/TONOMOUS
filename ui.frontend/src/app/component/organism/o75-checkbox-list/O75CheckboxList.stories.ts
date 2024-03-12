import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import O75CheckboxList from './O75CheckboxList';
import { O75CheckboxListProps } from './O75CheckboxList.types';
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
  component: O75CheckboxList,
  title: `NEOM/organism/O75CheckboxList`,
  argTypes: argTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders a checkbox list fieldset.',
      },
    },
  },
} as Meta;

const Template = () => ({
  template: `<hbs>{{> o75-checkbox-list }}</hbs>`,
});

export const Default = withMappedProps<O75CheckboxListProps>(Template);
Default.args = flattenedProps;
