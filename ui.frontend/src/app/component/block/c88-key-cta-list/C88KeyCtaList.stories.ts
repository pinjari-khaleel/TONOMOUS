import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C88KeyCtaListData from './data/default.yaml';
import { C88KeyCtaListProps } from './C88KeyCtaList.types';

const flattenedData = flattenProps(C88KeyCtaListData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C88KeyCtaList`,
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

export const Default = withMappedProps<C88KeyCtaListProps>(Template);

Default.args = flattenedData;
