import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { ContentItemProps } from '../../../data/interface/ContentItemProps';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type O78TimelineCardProps = {
  id?: string;
  scrollComponent?: boolean;
  heading: A03HeadingProps;
  copy: ContentItemProps;
  button?: M02ButtonProps;
};
