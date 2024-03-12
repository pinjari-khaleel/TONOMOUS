import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { A02IconProps } from '../../atom/a02-icon/A02Icon.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import M12SocialProps from '../../molecule/m12-social/M12Social.types';
import { SectorClickTrackingEvent } from '../../../util/TrackingEvent';

export type O11ModalContentProps = {
  backButtonLabel?: string;
  icon?: A02IconProps;
  heading: A03HeadingProps;
  subTitle?: string;
  eventTracking?: SectorClickTrackingEvent;
  image?: A01ImageProps;
  copy?: string;
  list?: { heading?: A03HeadingProps; buttons: Array<O11ModalContentItemButton> };
} & (
  | {
      buttons?: { heading?: A04EyebrowProps; items: Array<M02ButtonProps> };
      social?: never;
    }
  | {
      social?: M12SocialProps;
      buttons?: never;
    }
);

export type O11ModalContentItemButton = M02ButtonProps & { nestedModalId: string };

export default O11ModalContentProps;
