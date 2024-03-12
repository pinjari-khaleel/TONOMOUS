import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C97WhatWeDoCardsData from './data/default.yaml';
import { C97WhatWeDoCardsProps } from './C97WhatWeDoCards.types';

const flattenedData = flattenProps(C97WhatWeDoCardsData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C97WhatWeDoCards`,
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

export const Default = withMappedProps<C97WhatWeDoCardsProps>(Template);

Default.args = flattenedData;
