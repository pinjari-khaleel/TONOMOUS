import { Args } from './mapToProps';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';

const headingOptions = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const alignmentOptions = ['start', 'center', 'end', 'none'];
const sizeOptions = ['small', 'medium', 'large', 'none'];

export const getFlatPropTypes = (flattenedData: Args) =>
  Object.entries(flattenedData).reduce((argTypes, [key, value]) => {
    if (typeof value === 'boolean') {
      return {
        ...argTypes,
        [key]: { control: { type: 'boolean' } },
      };
    }
    if (typeof value === 'string' && headingOptions.includes(value)) {
      return {
        ...argTypes,
        [key]: { control: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } },
      };
    }
    if (typeof value === 'string' && alignmentOptions.includes(value)) {
      return {
        ...argTypes,
        [key]: { control: { type: 'select', options: ['start', 'center', 'end', 'none'] } },
      };
    }
    if (typeof value === 'string' && sizeOptions.includes(value)) {
      return {
        ...argTypes,
        [key]: { control: { type: 'select', options: ['small', 'medium', 'large', 'none'] } },
      };
    }
    if (typeof value === 'string') {
      return {
        ...argTypes,
        [key]: { control: { type: 'text' } },
      };
    }
    if (typeof value === 'number') {
      return {
        ...argTypes,
        [key]: { control: { type: 'number' } },
      };
    }
    return argTypes;
  }, {} as ArgTypes);
