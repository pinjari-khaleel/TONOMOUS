import { User } from '../data/interface/User';

declare global {
  interface Window {
    dataLayer: Array<any>;
  }
}

export enum TrackingEventActions {
  SLIDER_CLICK = 'Slider Click',
  CTA_CLICK = 'CTA Button Click',
  ACCORDION_CLICK = 'Accordion Item Open',
}

export enum TrackingEventCategories {
  DOWNLOAD = 'Download',
  SLIDER_INTERACTION = 'Slider Interaction',
  CTA = 'CTA',
  ACCORDION_DROPDOWN_MENU = 'Accordion Menu',
}

export enum TrackingEventNames {
  DOWNLOAD = 'download',
  FORM_SUBMIT = 'Form Submit',
  SECTOR_CLICK = 'Sector Click',
  CLICK = 'Click',
  SLIDER_IMPRESSION = 'Slider Impression',
  SLIDER_INTERACTION = 'slider_interaction',
  VIDEO_PROGRESS = 'video_progress',
  VIDEO_START = 'video_start',
  VIDEO_PAUSE = 'video_pause',
  VIDEO_COMPLETE = 'video_complete',
  VIDEO_SEEK = 'video_seek',
  VIDEO_CLOSE = 'video_close',
  VIRTUAL_PAGEVIEW = 'virtualPageview',
  FORM_FUNNEL = 'Form Funnel',
  FORM_IMPRESSION = 'Form Impression',
  SOCIAL_FAVICON = 'Social Favicon',
}

export interface VideoTrackingEventBaseProps {
  src: string;
  title: string;
  titleInEnglish: string;
}

export type VirtualPageview = {
  event: TrackingEventNames.VIRTUAL_PAGEVIEW;
  page: {
    canonicalURL: string;
    locale: string;
    lastModifiedDate: string;
    title: string;
    path: string;
    url: string;
    hostname: string;
  };
  user: {
    id: string;
  };
};

export type DownloadTrackingEvent = {
  event: TrackingEventNames.DOWNLOAD;
  eventAction: string;
  eventCategory: TrackingEventCategories.DOWNLOAD;
  eventLabel: string | ReadonlyArray<string>;
};

export type FormSubmitTrackingEvent = {
  event: TrackingEventNames.FORM_SUBMIT;
  form?: {
    crmLeadID?: string;
    data?: ReadonlyArray<{
      fieldErrorInEnglish?: string;
      fieldTitleInEnglish: string;
      fieldValue: string | Array<string>;
    }>;
    error: boolean;
    errorMessage: string | null;
    id: string;
    response: {
      message: string;
      status: number;
    };
    titleInEnglish: string;
    user?: User;
  };
};

export type SectorClickTrackingEvent = {
  event: TrackingEventNames.SECTOR_CLICK;
  sector: {
    titleInEnglish: string;
    title: string;
  };
};

export type AccordionClickTrackingEvent = {
  event: TrackingEventNames.CLICK;
  eventLabel: string;
  eventAction: string | TrackingEventActions.ACCORDION_CLICK;
  eventCategory: TrackingEventCategories.ACCORDION_DROPDOWN_MENU;
  componentId: string;
};

export type CTAClickTrackingEvent = {
  event: TrackingEventNames.CLICK;
  eventLabel: string;
  eventAction: TrackingEventActions.CTA_CLICK;
  eventCategory: TrackingEventCategories.CTA;
  ctaId: string;
};

export type SliderImpressionTrackingEvent = {
  event: TrackingEventNames.SLIDER_IMPRESSION;
  slider: {
    slideTitleInEnglish: string;
    slideOrder: number;
  };
  componentId: string;
};

export type SliderInteractionTrackingEvent = {
  event: TrackingEventNames.SLIDER_INTERACTION;
  sliderAction: TrackingEventActions.SLIDER_CLICK;
  sliderCategory: TrackingEventCategories.SLIDER_INTERACTION;
  componentId: string;
};

export type VideoStartTrackingEvent = {
  event: TrackingEventNames.VIDEO_START;
  video: VideoTrackingEventBaseProps;
};

export type VideoPauseTrackingEvent = {
  event: TrackingEventNames.VIDEO_PAUSE;
  video: VideoTrackingEventBaseProps;
};

export type VideoCompleteTrackingEvent = {
  event: TrackingEventNames.VIDEO_COMPLETE;
  video: VideoTrackingEventBaseProps;
};

export type VideoProgressTrackingEvent = {
  event: TrackingEventNames.VIDEO_PROGRESS;
  video: VideoTrackingEventBaseProps & {
    milestone: string;
  };
};

export type VideoSeekTrackingEvent = {
  event: TrackingEventNames.VIDEO_SEEK;
  video: VideoTrackingEventBaseProps;
};

export type VideoCloseTrackingEvent = {
  event: TrackingEventNames.VIDEO_CLOSE;
  video: VideoTrackingEventBaseProps;
};

export type FormFunnelTrackingEvent = {
  event: TrackingEventNames.FORM_FUNNEL;
  step: number;
  form: {
    titleInEnglish: string;
  };
};

export type SocialFaviconTrackingEvent = {
  event: TrackingEventNames.SOCIAL_FAVICON;
  socialNetwork: string;
};

export type FormImpressionTrackingEvent = {
  event: TrackingEventNames.FORM_IMPRESSION;
  form: {
    titleInEnglish: string;
    id: string;
  };
};

export default function trackEvent(
  event:
    | VirtualPageview
    | DownloadTrackingEvent
    | FormSubmitTrackingEvent
    | SectorClickTrackingEvent
    | SliderInteractionTrackingEvent
    | SliderImpressionTrackingEvent
    | VideoStartTrackingEvent
    | VideoPauseTrackingEvent
    | VideoProgressTrackingEvent
    | VideoCompleteTrackingEvent
    | VideoSeekTrackingEvent
    | VideoCloseTrackingEvent
    | CTAClickTrackingEvent
    | AccordionClickTrackingEvent
    | FormFunnelTrackingEvent
    | SocialFaviconTrackingEvent
    | FormImpressionTrackingEvent,
): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log('customEvent', event);
  }
  if (window.dataLayer) {
    window.dataLayer.push(event);
  }
}
