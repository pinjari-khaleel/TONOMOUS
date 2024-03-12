// TODO: Use this util in o29 dropdown navigation

export const setInitialActiveIndicator = (activeElement: HTMLElement, indicator: HTMLElement) => {
  const defaultElementPosition = activeElement.offsetLeft;
  const defaultElementWidth = activeElement.offsetWidth;
  indicator!.style.width = `${defaultElementWidth}px`;
  indicator!.style.left = `${defaultElementPosition}px`;
};

export const updateActiveIndicator = (activeElement: HTMLElement, indicator: HTMLElement) => {
  indicator.style.width = `${activeElement.offsetWidth}px`;
  indicator.style.left = `${activeElement.offsetLeft}px`;
};
