export const hasComponentEnteredViewport = (element: HTMLElement) => {
  const boundingClientRect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (boundingClientRect.top <= windowHeight) {
    return true;
  }
};

export const isElementVisibleInContainer = (container: HTMLElement, element: HTMLElement) => {
  const { bottom, height, top } = element.getBoundingClientRect();
  const { top: containerTop, bottom: containerBottom } = container.getBoundingClientRect();

  const isInView =
    top <= containerTop ? containerTop - top <= height : bottom - containerBottom <= height;

  return isInView;
};

export const isElementVisibleInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
};

export const isElementInMiddle = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementMidY = (rect.top + rect.bottom) / 2;
  return elementMidY >= windowHeight / 4 && elementMidY <= (3 * windowHeight) / 4;
};
