import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import A23CountrySelectData from './data/example.yaml';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

const flattenedData = flattenProps(A23CountrySelectData);

const flattenedPropsTypes = getFlatPropTypes(flattenedData);

export default {
  title: 'NEOM/atom/A23 Country Select',
  component: require('./A23CountrySelect'),
  argTypes: {
    ...flattenedPropsTypes,
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a select dropdown with country flags, codes and labels.',
      },
    },
  },
};

const Template = () => {
  return {
    template: `<hbs>
      <div style="position: relative; max-width: {{#if isWideDropdown}}320px{{^}}160px{{/if}};">{{> a23-country-select }}</div>
    </hbs>`,
  };
};

export const Default = withMappedProps(Template);

Default.args = flattenedData;
