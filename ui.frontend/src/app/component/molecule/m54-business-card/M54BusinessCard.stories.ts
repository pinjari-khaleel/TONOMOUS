import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M54BusinessCard from './M54BusinessCard';
import M54BusinessCardData from './data/default.yaml';
import { M54BusinessCardProps } from './M54BusinessCard.types';

const flattenedData = flattenProps(M54BusinessCardData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: M54BusinessCard,
  title: `NEOM/molecule/M54BusinessCard`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> m54-business-card }}</hbs>`,
  };
};

export const Default = withMappedProps<M54BusinessCardProps>(Template);

Default.args = flattenedData;
