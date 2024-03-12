import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { registerComponent } from 'muban-core';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import C85LogoMarquee from './C85LogoMarquee.lazy';
import C85LogoMarqueeData from './data/default.yaml';
import { C85LogoMarqueeProps } from './C85LogoMarquee.types';

registerComponent(C85LogoMarquee);

const flattenedData = flattenProps(C85LogoMarqueeData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C85LogoMarquee`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c85-logo-marquee }}</hbs>`,
  };
};

export const Default = withMappedProps<C85LogoMarqueeProps>(Template);

Default.args = flattenedData;
