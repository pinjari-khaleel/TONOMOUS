// need a bit of delay in case scroll height of container is manipulated by swiper js

export const scrollIntoViewWithDelay = (element: HTMLElement, delay: number) =>
  setTimeout(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
  }, delay);
