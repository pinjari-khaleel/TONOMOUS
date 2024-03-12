import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import O76RadioGroup from './O76RadioGroup';
import { O76RadioGroupProps } from './O76RadioGroup.types';
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
  component: O76RadioGroup,
  title: `NEOM/organism/O76RadioGroup`,
  argTypes: argTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders a radio group fieldset with copy.',
      },
    },
  },
} as Meta;

const Template = () => ({
  template: `<hbs>{{> o76-radio-group }}</hbs>`,
});

export const Default = withMappedProps<O76RadioGroupProps>(Template);
Default.args = flattenedProps;
