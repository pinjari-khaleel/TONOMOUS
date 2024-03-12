import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import multipleChoiceData from './data/multipleChoice.yaml';
import singleChoiceData from './data/singleChoice.yaml';
import O15StylizedOptions from './O15StylizedOptions';
import { O15StylizedOptionsProps } from './O15StylizedOptions.types';

const flattenedPropsMultipleChoice = flattenProps(multipleChoiceData);
const flattenedPropsSingleChoice = flattenProps(singleChoiceData);

const argTypes = [
  ...Object.keys(flattenedPropsMultipleChoice),
  ...Object.keys(flattenedPropsSingleChoice),
].reduce((argTypes, flatPropKey) => {
  if (!flatPropKey.includes('required') && !flatPropKey.includes('wide')) {
    return { ...argTypes, [flatPropKey]: { control: { type: 'text' } } };
  } else {
    return { ...argTypes, [flatPropKey]: { control: { type: 'boolean' } } };
  }
}, {});

export default {
  component: O15StylizedOptions,
  title: `NEOM/organism/O15StylizedOptions`,
  argTypes: argTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Renders a stylized list of checkboxes for multiple choice or radio buttons for single choice.',
      },
    },
  },
};

const Template = () => ({
  template: `<hbs>{{> o15-stylized-options }}</hbs>`,
});

export const MultipleChoice = withMappedProps<O15StylizedOptionsProps>(Template);
export const SingleChoice = withMappedProps<O15StylizedOptions>(Template);

MultipleChoice.args = flattenedPropsMultipleChoice;
SingleChoice.args = flattenedPropsSingleChoice;
