import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import O80 from './O80MultiselectDropdown';
import { O80MultiselectDropdownProps } from './O80MultiselectDropdown.types';
import data from './data/default.yaml';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

const flattenedProps = flattenProps(data);

const argTypes = getFlatPropTypes(flattenedProps);

export default {
  component: O80,
  title: `NEOM/organism/O80MultiselectDropdown`,
  argTypes: argTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders a multi select with checkbox options.',
      },
    },
  },
} as Meta;

const Template = () => ({
  template: `<hbs>
              <style>
                  .a-checkbox__input:checked ~ .a-checkbox__indicator {
                    --checkbox-background-color: var(--color-dark-gold);
                    --checkbox-border-color: var(--color-dark-gold);
                }
              </style>
              {{> o80-multiselect-dropdown }}
             </hbs>`,
});

export const Default = withMappedProps<O80MultiselectDropdownProps>(Template);
Default.args = flattenedProps;
