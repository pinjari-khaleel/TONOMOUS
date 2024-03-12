import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import A05MoustacheProps from 'app/component/atom/a05-moustache/A05Moustache.types';

export type M49MultipleCopyProps = {
  id?: string;
  scrollComponent?: boolean;
  icon?: string;
  eyebrow?: A04EyebrowProps;
  heading?: A03HeadingProps;
  moustache?: A05MoustacheProps;
  copy: Array<{
    size?: 'small' | 'medium' | 'large';
    content: string;
    highlight?: boolean;
    uppercase?: boolean;
  }>;
};
