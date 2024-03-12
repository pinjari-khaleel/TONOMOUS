import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import M12SocialProps from './M12Social.types';
import M12DefaultData from './data/example.yaml';

const flattenedDataDefaultExample = flattenProps(M12DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M12 Social',
  component: require('./M12Social'),
  argTypes: flattenedPropsTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders a selection of socials',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
      {{> m12-social}}
    </hbs>`,
});

export const Default = withMappedProps<M12SocialProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
