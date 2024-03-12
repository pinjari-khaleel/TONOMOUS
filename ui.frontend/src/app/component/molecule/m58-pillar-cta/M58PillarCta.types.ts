import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import { LinkProps } from 'app/data/interface/LinkProps';
import { CTAClickTrackingEvent } from 'app/util/TrackingEvent';

export type M58PillarCtaProps = {
  id?: string;
  title: string;
  icon: string;
  backgroundImage?: A01ImageProps;
  aria?: Record<string, string>;
  eventTracking?: CTAClickTrackingEvent;
} & LinkProps;
