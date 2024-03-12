export const setVisibility = (isVisible: boolean, ...elements: Array<HTMLElement>) => {
  elements.forEach((element) => (element.style.display = isVisible ? 'block' : 'none'));
};
