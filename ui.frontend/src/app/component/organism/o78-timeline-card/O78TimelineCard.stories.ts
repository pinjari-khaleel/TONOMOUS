import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import O78TimelineCard from './O78TimelineCard';
import O78Data from './data/default.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { O78TimelineCardProps } from './O78TimelineCard.types';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

const flattenedData = flattenProps(O78Data);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: O78TimelineCard,
  title: `NEOM/organism/O78TimelineCard`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

const Template = () => ({
  template: `<hbs>
 {{> o78-timeline-card }}
</hbs>`,
});

export const Default = withMappedProps<O78TimelineCardProps>(Template);

Default.args = flattenedData;
