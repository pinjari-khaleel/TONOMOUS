import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M55ImagePagination from './M55ImagePagination';
import M55ImagePaginationData from './data/default.yaml';
import { M55ImagePaginationProps } from './M55ImagePagination.types';

const flattenedData = flattenProps(M55ImagePaginationData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: M55ImagePagination,
  title: `NEOM/molecule/M55ImagePagination`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> m55-image-pagination }}</hbs>`,
  };
};

export const Default = withMappedProps<M55ImagePaginationProps>(Template);

Default.args = flattenedData;
