import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import M16FigureProps from './M16Figure.types';
import M16ImageData from '../m16-figure/data/example-asset-image.yaml';
import M16PortraitData from '../m16-figure/data/example-asset-portrait.yaml';
import M16SquareData from '../m16-figure/data/example-asset-square.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

const flattenedImageData = flattenProps(M16ImageData);
const flattenedPortraitData = flattenProps(M16PortraitData);
const flattenedSquareData = flattenProps(M16SquareData);

const flattenedArgTypes = [flattenedImageData, flattenedPortraitData, flattenedSquareData].reduce(
  (flattenedArgTypes, data) => {
    const argTypes = getFlatPropTypes(data);

    return { ...flattenedArgTypes, ...argTypes };
  },
  {} as ArgTypes,
);

export default {
  title: 'NEOM/molecule/M16 Figure',
  component: require('./M16Figure'),
  argTypes: {
    ...flattenedArgTypes,
    variant: {
      control: { type: 'select', options: ['square', 'circle', 'widescreen'] },
      description: 'Figure variants.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders figure.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m16-figure }}
  </hbs>`,
});

export const Image = withMappedProps<M16FigureProps>(DefaultTemplate);
export const Portrait = withMappedProps<M16FigureProps>(DefaultTemplate);
export const Square = withMappedProps<M16FigureProps>(DefaultTemplate);

Image.args = flattenedImageData;
Portrait.args = flattenedPortraitData;
Square.args = flattenedSquareData;
