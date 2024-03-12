import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { ContentItemProps } from '../../../data/interface/ContentItemProps';
import A05MoustacheProps from '../../atom/a05-moustache/A05Moustache.types';

export type M18ParagraphProps = M18ParagraphItem | M18ParagraphImageItem;

interface M18ParagraphItem {
  icon?: string;
  alignAsset?: 'start' | 'center' | 'end'; // default is center
  eyebrow?: A04EyebrowProps;
  heading?: A03HeadingProps;
  moustache?: A05MoustacheProps;
  copy?: ContentItemProps;
}

interface M18ParagraphImageItem extends Omit<M18ParagraphItem, 'icon'> {
  image: A01ImageProps;
}

export default M18ParagraphProps;
