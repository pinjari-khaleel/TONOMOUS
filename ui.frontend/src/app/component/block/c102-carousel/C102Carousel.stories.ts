import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { registerComponent } from 'muban-core';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import C102Carousel from './C102Carousel.lazy';
import C102CarouselData from './data/default.yaml';
import { C102CarouselProps } from './C102Carousel.types';

registerComponent(C102Carousel);

const flattenedData = flattenProps(C102CarouselData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C102Carousel`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c102-carousel }}</hbs>`,
  };
};

export const Default = withMappedProps<C102CarouselProps>(Template);

Default.args = flattenedData;
