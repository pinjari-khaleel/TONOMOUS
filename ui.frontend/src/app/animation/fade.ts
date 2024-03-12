import { TweenLite, Linear } from 'gsap';

export function fadeFromTo(
  element: Element | HTMLElement | Array<HTMLElement>,
  duration: number = 0.5,
  from: number = 0,
  to: number = 1,
  autoAlpha: boolean = true,
  clearProps: boolean = true,
): TweenLite {
  return TweenLite.fromTo(
    element,
    duration,
    { [autoAlpha ? 'autoAlpha' : 'opacity']: from },
    {
      [autoAlpha ? 'autoAlpha' : 'opacity']: to,
      ease: Linear.easeNone,
      clearProps: clearProps ? 'opacity,visibility' : '',
    },
  );
}

export function fadeTo(
  element: Element | HTMLElement | Array<HTMLElement>,
  duration: number = 0.5,
  to: number = 0,
  autoAlpha: boolean = true,
  clearProps: boolean = false,
): TweenLite {
  return TweenLite.to(element, duration, {
    [autoAlpha ? 'autoAlpha' : 'opacity']: to,
    ease: Linear.easeNone,
    clearProps: clearProps ? 'opacity,visibility' : '',
  });
}
