import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import M17CriteriaData from '../m17-list/data/brandbook-photography-criteria-list.yaml';
import M17RatiosData from '../m17-list/data/brandbook-photography-ratios-list.yaml';
import M17BulletedData from '../m17-list/data/bulleted.yaml';
import M17DefinitionsData from '../m17-list/data/definitions.yaml';
import M17DefinitionsOrderedData from '../m17-list/data/definitions-ordered.yaml';
import M17OrderedData from '../m17-list/data/ordered.yaml';
import M17ListProps from './M17List.types';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';

const flattenedCriteriaData = flattenProps(M17CriteriaData);
const flattenedRatiosData = flattenProps(M17RatiosData);
const flattenedBulletedData = flattenProps(M17BulletedData);
const flattenedDefinitionsData = flattenProps(M17DefinitionsData);
const flattenedDefinitionsOrderedData = flattenProps(M17DefinitionsOrderedData);
const flattenedOrderedData = flattenProps(M17OrderedData);

const flattenedArgTypes = [
  flattenedCriteriaData,
  flattenedRatiosData,
  flattenedBulletedData,
  flattenedDefinitionsData,
  flattenedDefinitionsOrderedData,
  flattenedOrderedData,
].reduce((flattenedArgTypes, data) => {
  const argTypes = getFlatPropTypes(data);

  return { ...flattenedArgTypes, ...argTypes };
}, {} as ArgTypes);

export default {
  title: 'NEOM/molecule/M17 List',
  component: require('./M17List'),
  argTypes: {
    ...flattenedArgTypes,
    ordered: {
      control: { type: 'boolean' },
      description: 'Type of the list.',
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description: 'Size of list text.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an unordered/ordered list.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m17-list }}
  </hbs>`,
});

export const CriteriaList = withMappedProps<M17ListProps>(DefaultTemplate);
export const RatiosList = withMappedProps<M17ListProps>(DefaultTemplate);
export const Bulleted = withMappedProps<M17ListProps>(DefaultTemplate);
export const Definitions = withMappedProps<M17ListProps>(DefaultTemplate);
export const DefinitionsOrdered = withMappedProps<M17ListProps>(DefaultTemplate);
export const Ordered = withMappedProps<M17ListProps>(DefaultTemplate);

CriteriaList.args = flattenedCriteriaData;
RatiosList.args = flattenedRatiosData;
Bulleted.args = flattenedBulletedData;
Definitions.args = flattenedDefinitionsData;
DefinitionsOrdered.args = flattenedDefinitionsOrderedData;
Ordered.args = flattenedOrderedData;
