import { Power3, TweenMax } from 'gsap';
import { addEventListener } from 'seng-disposable-event-listener';
import eases from './eases';

type RippleEffectOptions = {
  animationBase: number;
};

/**
 * Helper method that can be triggered to create the ripple effect on a div.
 * @param buttonElement - The element that holds the ripple effect.
 * @param options - Any options that need to be passed
 * @returns () => void - The method that can be triggered to remove the event listener.
 */
export default function (
  buttonElement: HTMLElement,
  options: Partial<RippleEffectOptions> = {},
): () => void {
  const mergedOptions = { animationBase: 40, ...options };
  const rippleElement = document.createElement('span');

  rippleElement.classList.add('ripple');

  buttonElement.appendChild(rippleElement);

  const removeMouseListener = addEventListener(buttonElement, 'mousedown', (event: MouseEvent) => {
    const { left, top, width } = buttonElement.getBoundingClientRect();

    const isDisabled = buttonElement.parentElement?.getAttribute('disabled') !== null;
    if (!isDisabled)
      TweenMax.fromTo(
        rippleElement,
        1.2,
        {
          width: mergedOptions.animationBase,
          height: mergedOptions.animationBase,
          left: event.pageX - left,
          top: event.pageY - top - window.scrollY,
          opacity: 0.5,
        },
        {
          width: width * 2,
          height: width * 2,
          opacity: 0,
          ease: eases.VinnieInOut,
        },
      );
  });

  // Make sure we have the correct cleanup and everything returns to it's original state.
  return () => {
    removeMouseListener();

    buttonElement.removeChild(rippleElement);
  };
}
