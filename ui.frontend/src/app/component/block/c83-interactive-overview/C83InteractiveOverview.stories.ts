import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { registerComponent } from 'muban-core';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import C83InteractiveOverview from './C83InteractiveOverview.lazy';
import C83InteractiveOverviewData from './data/default.yaml';
import { C83InteractiveOverviewProps } from './C83InteractiveOverview.types';

registerComponent(C83InteractiveOverview);

const flattenedData = flattenProps(C83InteractiveOverviewData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C83InteractiveOverview`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c83-interactive-overview }}</hbs>`,
  };
};

export const Default = withMappedProps<C83InteractiveOverviewProps>(Template);

Default.args = flattenedData;
