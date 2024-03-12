import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import M58PillarCtaData from './data/pillar.yaml';
import { M58PillarCtaProps } from './M58PillarCta.types';

const flattenedData = flattenProps(M58PillarCtaData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/molecule/M58PillarCta`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> m58-pillar-cta }}</hbs>`,
  };
};

export const Default = withMappedProps<M58PillarCtaProps>(Template);

Default.args = flattenedData;
