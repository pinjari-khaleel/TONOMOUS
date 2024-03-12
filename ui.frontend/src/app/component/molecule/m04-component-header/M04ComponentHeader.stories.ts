import M04Data from '../m04-component-header/data/examples.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M04ComponentHeaderProps from './M04ComponentHeader.types';

const flattenedDataDefaultExample = flattenProps<M04ComponentHeaderProps>(M04Data[0]);

const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M04 Component Header',
  component: require('./M04ComponentHeader'),
  argTypes: {
    ...flattenedPropsTypes,
    alignment: {
      control: { type: 'select', options: ['start', 'center', 'end', 'none'] },
      description: 'Specifies the variant',
    },
    variant: {
      control: {
        type: 'text',
      },
    },
    flipHeading__size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    flipHeading__element: {
      control: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    },
    flipHeading__labels__0: { control: { type: 'text' } },
    flipHeading__labels__1: { control: { type: 'text' } },
    flipHeading__labels__2: { control: { type: 'text' } },
    flipHeading__prefix: { control: { type: 'text' } },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a component header element',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    <div>{{> m04-component-header}}</div>
    </hbs>`,
});

export const Default = withMappedProps<M04ComponentHeaderProps>(DefaultTemplate);
export const ExampleOne = withMappedProps<M04ComponentHeaderProps>(DefaultTemplate);
export const ExampleTwo = withMappedProps<M04ComponentHeaderProps>(DefaultTemplate);

Default.args = flattenedDataDefaultExample;
ExampleOne.args = flattenProps<M04ComponentHeaderProps>(M04Data[1]);
ExampleTwo.args = flattenProps<M04ComponentHeaderProps>(M04Data[2]);
