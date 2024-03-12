import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { registerComponent } from 'muban-core';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import C86PeopleCarousel from './C86PeopleCarousel.lazy';
import C86PeopleCarouselData from './data/default.yaml';
import { C86PeopleCarouselProps } from './C86PeopleCarousel.types';

registerComponent(C86PeopleCarousel);

const flattenedData = flattenProps(C86PeopleCarouselData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C86PeopleCarousel`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c86-people-carousel }}</hbs>`,
  };
};

export const Default = withMappedProps<C86PeopleCarouselProps>(Template);

Default.args = flattenedData;
