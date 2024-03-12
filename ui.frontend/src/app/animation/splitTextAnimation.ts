import { TimelineMax } from 'gsap';
import { SplitText } from '../vendor/gsap/SplitText';
import eases from './eases';

export enum SplitAnimationStart {
  LEFT = 'start',
  CENTER = 'center',
  RIGHT = 'end',
}

export function splitWordAnimationVertical(
  split: typeof SplitText,
  from: SplitAnimationStart,
): TimelineMax {
  const timeline = new TimelineMax();

  const staggerAmount = Math.min(0.8, split.words.length * 0.05);

  split.lines.forEach((line: HTMLElement, index: number) => {
    timeline.staggerFromTo(
      line.children,
      0.8,
      {
        y: 50,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        clearProps: 'y,opacity,visibility',
        ease: eases.VinnieInOut,
        stagger: {
          from: SplitAnimationStart.LEFT,
          amount: staggerAmount,
        },
      },
      0,
      index * 0.1,
    );
  });

  return timeline;
}

export function splitWordAnimationHorizontal(
  split: typeof SplitText,
  from: SplitAnimationStart,
): TimelineMax {
  const timeline = new TimelineMax();

  const staggerAmount = Math.min(0.8, split.words.length * 0.05);

  split.lines.forEach((line: HTMLElement, index: number) => {
    timeline.staggerFromTo(
      line.children,
      0.8,
      {
        x: -50,
        autoAlpha: 0,
      },
      {
        x: 0,
        autoAlpha: 1,
        clearProps: 'y,opacity,visibility',
        ease: eases.VinnieInOut,
        stagger: {
          from: SplitAnimationStart.LEFT,
          amount: staggerAmount,
        },
      },
      0,
      index * 0.1,
    );
  });

  return timeline;
}
