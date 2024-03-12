import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { M52StylizedOptionProps } from './M52StylizedOption.types';
import M52StylizedOption from './M52StylizedOption';
import data from './data/default.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { CheckboxItem, RadioItem } from 'app/data/type/Form.types';

export default {
  component: M52StylizedOption,
  title: `NEOM/molecule/M52StylizedOption`,
  argTypes: {
    type: {
      control: { type: 'radio', options: ['radio', 'checkbox'] },
    },
    name: {
      control: { type: 'text' },
    },
    value: {
      control: { type: 'text' },
    },
    label: {
      control: { type: 'text' },
    },
    id: {
      control: { type: 'text' },
    },
    image__alt: {
      control: { type: 'text' },
    },
    image__src: {
      control: { type: 'text' },
    },
  },
} as Meta;

const Template = () => ({
  template: `<hbs>
    {{#if dark}}<style>:root{--color-storybook-background:var(--color-black);--component-text-color:var(--color-white-70a); --component-heading-color: var(--color-white);}</style>{{/if}}
    {{> m52-stylized-option }}
</hbs>`,
});

// Component state
// the simplest way to create stories is to render a component with different arguments multiple times
export const Radio = withMappedProps<M52StylizedOptionProps<RadioItem | CheckboxItem>>(Template);
Radio.args = flattenProps(data);

export const Checkbox = Radio.bind({});
Checkbox.args = {
  ...flattenProps(data),
  type: 'checkbox',
};
