import M18ParagraphProps from './M18Paragraph.types';
import data from './data/example-haddah-beach.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';

export default {
  title: 'NEOM/molecule/M18 Paragraph',
  component: require('./M18Paragraph'),
  argTypes: {
    dark: { control: { type: 'boolean' } },
    icon: { control: { type: 'select', options: ['design-construction', 'water'] } },
    eyebrow__size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    eyebrow__text: { control: { type: 'text' } },
    heading__element: {
      control: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    },
    heading__size: { control: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } },
    heading__text: { control: { type: 'text' } },
    copy__content: { control: { type: 'text' } },
    copy__size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a set of pagination items to depict pagination UI for usage in sliders',
      },
    },
  },
};

const Template = () => {
  return {
    template: `<hbs>
    {{#if dark}}<style>:root{--color-storybook-background:var(--color-black);}</style>{{/if}}
    <div style="{{#if dark}}--component-highlight-color: var(--color-gold); color: var(--color-white);{{^}}--component-highlight-color: var(--color-dark-gold);{{/if}}text-align: center;">
      {{> m18-paragraph  }}
    </div>
  </hbs>`,
  };
};

export const Default = withMappedProps<M18ParagraphProps>(Template);

delete data.buttons;

const extendedData: M18ParagraphProps = {
  ...data,
  icon: 'water',
  heading: {
    ...data.heading,
    element: 'h3',
  },
};

Default.args = flattenProps<M18ParagraphProps>(extendedData);
