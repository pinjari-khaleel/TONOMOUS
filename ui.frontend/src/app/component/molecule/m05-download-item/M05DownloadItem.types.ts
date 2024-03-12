import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { LinkProps } from '../../../data/interface/LinkProps';

export type M05DownloadItemProps = {
  variant?: string;
  heading: A03HeadingProps;
  description: string;
  image: A01ImageProps;
  link: LinkProps;
  eventTracking?: Object;
};

export default M05DownloadItemProps;
