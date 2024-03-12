import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import {{pascalCase componentName}}Data from './data/default.yaml';
import { {{pascalCase componentName}}Props } from './{{pascalCase componentName}}.types';

const flattenedData = flattenProps({{pascalCase componentName}}Data);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/{{type}}/{{pascalCase componentName}}`,
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

export const Default = withMappedProps<{{pascalCase componentName}}Props>(Template);

Default.args = flattenedData;
