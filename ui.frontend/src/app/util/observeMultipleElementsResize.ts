export const observeMultipleElementsResize = (
  elements: ReadonlyArray<HTMLElement>,
  callback: ResizeObserverCallback,
): (() => void) => {
  const observer = new ResizeObserver(callback);

  elements.forEach((element) => observer.observe(element));

  return () => elements.forEach((element) => observer.unobserve(element));
};
