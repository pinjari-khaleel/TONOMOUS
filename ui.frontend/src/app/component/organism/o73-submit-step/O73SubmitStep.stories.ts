import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { O73SubmitStepProps } from './O73SubmitStep.types';
import data from './data/default.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import globalVariables from '../../../../data/_variables.yaml';

const argTypes = Object.keys(flattenProps(data)).reduce((accumulator, dataKey) => {
  if (dataKey.includes('buttons') || dataKey.includes('disableTransition')) {
    return { [dataKey]: { control: { type: 'boolean' } }, ...accumulator };
  }
  return { [dataKey]: { control: { type: 'text' } }, ...accumulator };
}, {});

export default {
  title: `NEOM/organism/O73SubmitStep`,
  argTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Renders the submit view for a form component. Includes both success and error message and buttons to match those states.',
      },
    },
  },
} as Meta;

const Template = () => ({
  template: `<hbs>{{> o73-submit-step }}</hbs>`,
  data: globalVariables,
});

export const Default = withMappedProps<O73SubmitStepProps>(Template);

Default.args = flattenProps(data);
