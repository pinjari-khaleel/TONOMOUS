import { A01ImageProps } from '../../atom/a01-image/A01Image.types';

export type M16FigureVariants = 'square' | 'circle' | 'widescreen';

export type M16FigureProps = {
  copy?: string;
  image: A01ImageProps;
  variant: M16FigureVariants;
};

export default M16FigureProps;
