export {};

declare global {
  interface Document {
    mozCancelFullScreen: () => Promise<void>;
    mozFullScreenElement: Element;
    mozFullscreenEnabled: boolean;

    webkitExitFullscreen: () => void;
    webkitFullscreenElement: Element;
    webkitFullscreenEnabled: boolean;
  }

  interface HTMLElement {
    mozRequestFullscreen: () => Promise<void>;
    webkitRequestFullscreen: () => void;
  }
}
