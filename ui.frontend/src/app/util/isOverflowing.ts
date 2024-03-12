export const isOverflowing = (element: HTMLElement) => {
  const currentOverflow = element.style.overflow;

  if (!currentOverflow || currentOverflow === 'visible') {
    element.style.overflow = 'hidden';
  }

  const isOverflowing =
    element.offsetWidth < element.scrollWidth || element.offsetHeight < element.scrollHeight;

  element.style.overflow = currentOverflow;

  return isOverflowing;
};
