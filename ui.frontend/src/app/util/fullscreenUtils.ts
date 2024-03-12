export const exitFullscreen = (): Promise<void> => {
  const method = document.exitFullscreen || document.mozCancelFullScreen;

  return method.call(document);
};

export const getFullscreenElement = (): Element | null =>
  document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement ||
  null;

export const isFullscreenEnabled = (): boolean =>
  document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled;

export const requestFullscreen = (element: HTMLElement): Promise<void> => {
  const method = element.requestFullscreen || element.mozRequestFullscreen;

  return method.call(element);
};
