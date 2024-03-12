import A06FlipHeadingData from './data/example.yaml';
import A06FlipHeadingProps from './A06FlipHeading.types';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';

export default {
  title: 'NEOM/atom/A06 Flip Heading',
  component: require('./A06FlipHeading'),
  argTypes: {
    prefix: { control: { type: 'text' } },
    labels__0: { control: { type: 'text' } },
    labels__1: { control: { type: 'text' } },
    labels__2: { control: { type: 'text' } },
    labels__3: { control: { type: 'text' } },
    element: {
      control: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      description: 'Specifies the HTML element',
    },
    size: {
      control: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Displays a heading with an animated list of terms to transition between.',
      },
    },
  },
};

const TemplateArabic = () => {
  return {
    template: `<hbs>
      <div data-component="app-root" dir="rtl">
        {{> a06-flip-heading }}
      </div>
    </hbs>`,
  };
};

const Template = () => {
  return {
    template: `<hbs>
        {{> a06-flip-heading }}
    </hbs>`,
  };
};

export const Default = withMappedProps<A06FlipHeadingProps>(Template);
export const Arabic = withMappedProps<A06FlipHeadingProps>(TemplateArabic);

Default.args = flattenProps(A06FlipHeadingData);
Arabic.args = flattenProps(A06FlipHeadingData);
