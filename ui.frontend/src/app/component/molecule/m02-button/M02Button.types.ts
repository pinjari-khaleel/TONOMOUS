import { CTAClickTrackingEvent } from 'app/util/TrackingEvent';
import { O01VideoConfig } from '../../organism/o01-video/O01Video.types';

export type M02ButtonLevel =
  | 'primary' // default when undefined
  | 'secondary'
  | 'tertiary';

export type M02ButtonSize =
  | 'large' // default when undefined
  | 'small';

export type M02ButtonTarget = '_self' | '_blank';

export type M02ButtonTheme =
  | 'black' // default when undefined
  | 'white'
  | 'accent'
  | 'dark-accent'
  /**
   * Only available on regular site theme
   */
  | 'cream'
  | 'gold'
  | 'dark-gold'
  /**
   * Only available on Tonomus site theme
   */
  | 'green';

export type M02ButtonType = 'button' | 'submit' | 'reset';

export type M02ButtonVariant = 'play' | 'playbackControls' | 'navigation' | 'close' | 'download';

export type M02ButtonProps = {
  aria?: Record<string, string>;
  data?: Record<string, string>;
  disabled?: boolean;
  href?: string;
  icon?: string;
  iconAlignment: 'left' | 'right';
  label?: string;
  level: M02ButtonLevel;
  modal?: Object;
  prefix?: string;
  size: M02ButtonSize;
  suffix?: string;
  target?: M02ButtonTarget;
  theme: M02ButtonTheme;
  title?: string;
  type?: M02ButtonType;
  variant?: M02ButtonVariant;
  video?: O01VideoConfig;
  eventTracking?: CTAClickTrackingEvent;
};
