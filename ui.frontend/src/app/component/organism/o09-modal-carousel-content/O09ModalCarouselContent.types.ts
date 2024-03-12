import { A01ImageProps } from './../../atom/a01-image/A01Image.types';
import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';

import { A19VideoProps } from 'app/component/atom/a19-video/A19Video.types';
import { A02IconProps } from '../../atom/a02-icon/A02Icon.types';

export type O09ModalCarouselContentProps = {
  activeItemIndex: number;
  variant?: string;
  items: Array<O09ModalCarouselContentItem>;
  backButtonLabel?: string;
};

export type O09ModalCarouselContentItem = {
  content?: {
    image?: A01ImageProps;
    preview?: A19VideoProps;
    video?: A19VideoProps;
    heading?: Omit<A03HeadingProps, 'element'>;
    copy?: string;
    buttons?: Array<M02ButtonProps>;
    phoneNumber?: string;
    email?: string;
    subTitle?: Array<{
      icon?: A02IconProps;
      label: string;
    }>;
  };
};
