import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';

type CtaListItem = {
  text: string;
  icon: string;
  description?: string;
};

export type C88KeyCtaListProps = {
  id?: string;
  scrollComponent?: boolean;
  padding?: BlockComponentPadding;
  text: string;
  heading: A03HeadingProps;
  list: ReadonlyArray<CtaListItem>;
};
