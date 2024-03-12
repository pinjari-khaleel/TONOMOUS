import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { M32ShareButtonProps } from '../../molecule/m32-share-button/M32ShareButton.types';

export type O46ShareListProps = {
  heading: A03HeadingProps;
  items: Array<M32ShareButtonProps>;
  successMessage: string;
};
