import { MODAL, POPUP, VIDEO, LIGHTBOX } from 'app/util/overlayActionTypes';

export type C78OverlayProps = {
  id?: string;
  scrollComponent?: boolean;
};

type DynamicPayload = {
  template: (data: any) => any;
  data: any;
  options?: { classnames?: Array<string> };
};

type DynamicPayloadModal = Omit<DynamicPayload, 'data'> & {
  data: {
    backButtonLabel?: string;
    [key: string]: any;
  };
};

export type OVERLAY_ACTIONS = POPUP_ACTIONS | MODAL_ACTIONS | LIGHTBOX_ACTIONS | VIDEO_ACTIONS;

// POPUP ACTIONS

export type POPUP_ACTIONS = OPEN_POPUP_STANDARD_DYNAMIC | POPUP_CLOSE;

export type OPEN_POPUP_STANDARD_DYNAMIC = {
  type: POPUP.STANDARD_DYNAMIC;
  payload: DynamicPayload;
};

export type POPUP_CLOSE = {
  type: POPUP.CLOSE;
};

// MODAL ACTIONS

export type MODAL_ACTIONS = OPEN_MODAL_STANDARD_DYNAMIC | MODAL_CLOSE;

export type OPEN_MODAL_STANDARD_DYNAMIC = {
  type: MODAL.STANDARD_DYNAMIC;
  payload: DynamicPayloadModal;
};

export type MODAL_CLOSE = {
  type: MODAL.CLOSE;
};

// LIGHTBOX ACTIONS

export type LIGHTBOX_ACTIONS = OPEN_LIGHTBOX_STANDARD_DYNAMIC | LIGHTBOX_CLOSE;

export type OPEN_LIGHTBOX_STANDARD_DYNAMIC = {
  type: LIGHTBOX.STANDARD_DYNAMIC;
  payload: DynamicPayload;
};

export type LIGHTBOX_CLOSE = {
  type: LIGHTBOX.CLOSE;
};

// VIDEO ACTIONS

export type VIDEO_ACTIONS = OPEN_VIDEO_STANDARD_DYNAMIC | VIDEO_CLOSE;

export type VIDEO_CLOSE = {
  type: VIDEO.CLOSE;
};

export type OPEN_VIDEO_STANDARD_DYNAMIC = {
  type: VIDEO.STANDARD_DYNAMIC;
  payload: DynamicPayload;
};
