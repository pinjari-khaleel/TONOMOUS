import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import M59OpportunityCardData from './data/default.yaml';
import { M59OpportunityCardProps } from './M59OpportunityCard.types';

const flattenedData = flattenProps(M59OpportunityCardData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/molecule/M59OpportunityCard`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs></hbs>`,
  };
};

export const Default = withMappedProps<M59OpportunityCardProps>(Template);

Default.args = flattenedData;
