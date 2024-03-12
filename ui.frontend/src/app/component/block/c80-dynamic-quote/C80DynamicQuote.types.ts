import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import { ShareProps } from 'app/data/type/Share';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';

export type C80DynamicQuoteProps = {
  id?: string;
  scrollComponent?: boolean;
  padding?: BlockComponentPadding;
  items: Array<QuoteItemProps>;
  nextQuoteCTALabel: M02ButtonProps['label'];
};

export type QuoteItemProps = {
  quote: A03HeadingProps;
  active: boolean | null;
  image: A01ImageProps;
  content: string;
  shareQuoteButton: ShareProps;
};
