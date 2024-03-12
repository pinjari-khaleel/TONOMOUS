import { TimelineMax } from 'gsap';
import eases from './eases';

export function slideFadeIn(
  elements: ReadonlyArray<HTMLElement | Element>,
  duration = 0.5,
  stagger = duration * 0.2,
  delay = 0,
): TimelineMax {
  const timeline = new TimelineMax();

  timeline.staggerFromTo(
    elements,
    duration,
    {
      y: 50,
      autoAlpha: 0,
    },
    {
      y: 0,
      autoAlpha: 1,
      ease: eases.VinnieInOut,
      clearProps: 'y,autoAlpha',
      delay: delay,
    },
    stagger,
  );

  return timeline;
}

export function slideScaleFadeIn(
  elements: ReadonlyArray<HTMLElement>,
  duration = 0.5,
  stagger = 0.1,
): TimelineMax {
  const timeline = new TimelineMax();

  timeline.staggerFromTo(
    elements,
    duration,
    {
      y: 50,
      scale: 0.6,
      autoAlpha: 0,
    },
    {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      ease: eases.VinnieInOut,
      clearProps: 'y,autoAlpha,scale',
    },
    stagger,
  );

  return timeline;
}
