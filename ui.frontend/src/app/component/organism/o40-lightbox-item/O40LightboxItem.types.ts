import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { O01VideoConfig } from '../../organism/o01-video/O01Video.types';

export type O40LightboxInformationLabels =
  | 'Credit'
  | 'Album'
  | 'Format'
  | 'Licence Type'
  | 'Uploaded on';

export type O40LightboxItemProps = {
  heading: string;
  datePublished: string;
  image?: A01ImageProps;
  video?: {
    props: O01VideoConfig;
  };
  link: {
    label: string;
    href: string;
  };
  lightbox: {
    image?: A01ImageProps;
    content: {
      copy: string;
      information: Array<{
        label: O40LightboxInformationLabels;
        value: string;
      }>;
    };
  };
};

export default O40LightboxItemProps;
