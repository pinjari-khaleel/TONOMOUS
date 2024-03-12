import A07LabelProps from '../../atom/a07-label/A07Label.types';
import { CTAClickTrackingEvent } from '../../../util/TrackingEvent';
import { O01VideoConfig } from '../../organism/o01-video/O01Video.types';

export type M53TileCtaProps = {
  aria?: Record<string, string>;
  data?: Record<string, string>;
  disabled?: boolean;
  eventTracking?: CTAClickTrackingEvent;
  href?: string;
  icon?: string;
  label?: A07LabelProps;
  modal?: Object;
  target?: string;
  title?: string;
  video?: O01VideoConfig;
};
