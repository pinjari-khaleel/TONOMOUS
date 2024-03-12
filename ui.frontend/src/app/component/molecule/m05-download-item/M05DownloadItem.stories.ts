import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import M05DownloadItemProps from './M05DownloadItem.types';
import M05DefaultData from './data/default.yaml';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedData = flattenProps(M05DefaultData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: 'NEOM/molecule/M05 Download Item',
  argTypes: flatPropTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders an item with or without link to be downloaded',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m05-download-item }}
  </hbs>`,
});

export const Default = withMappedProps<M05DownloadItemProps>(DefaultTemplate);
Default.args = flattenedData;
