import { A19VideoProps } from './A19Video.types';
import defaultFallbackData from './data/defaultFallbackOnly.yaml';
import fallbackSourcesData from './data/fallbackSourcesOnly.yaml';
import responsiveSourcesData from './data/responsiveSourcesOnly.yaml';
import responsiveFallbackSourcesMixData from './data/mixResponsiveFallbackSrc.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

const responsiveSourcesFlattenedData = flattenProps(responsiveSourcesData);
const flatPropTypes = getFlatPropTypes(responsiveSourcesFlattenedData);

export default {
  title: 'NEOM/atom/A19 Video',
  component: require('./A19Video'),
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a video component.',
      },
    },
  },
};

const Template = () => {
  return {
    template: `<hbs>
        {{> a19-video }}
        </hbs>`,
  };
};

export const DefaultFallback = withMappedProps<A19VideoProps>(Template);
export const FallbackSources = withMappedProps<A19VideoProps>(Template);
export const ResponsiveSources = withMappedProps<A19VideoProps>(Template);
export const ResponsiveFallbackMixSources = withMappedProps<A19VideoProps>(Template);

DefaultFallback.args = flattenProps(defaultFallbackData);
FallbackSources.args = flattenProps(fallbackSourcesData);
ResponsiveSources.args = responsiveSourcesFlattenedData;
ResponsiveFallbackMixSources.args = flattenProps(responsiveFallbackSourcesMixData);
