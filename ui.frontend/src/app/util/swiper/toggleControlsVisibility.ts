import { StateClassNames } from 'app/data/enum/StateClassNames';

export const toggleControlsVisibility = (
  controls: HTMLElement | null,
  previousButton: HTMLElement | null,
  nextButton: HTMLElement | null,
) => {
  if (!controls) throw new Error('The controls element does not exist');
  if (!previousButton || !nextButton) throw new Error('The button element does not exist');

  const isDisabled = (element: HTMLElement | null) =>
    element?.classList.contains('swiper-button-disabled') ||
    element?.classList.contains(StateClassNames.DISABLED);

  isDisabled(previousButton) && isDisabled(nextButton)
    ? controls.classList.add(StateClassNames.HIDDEN)
    : controls.classList.remove(StateClassNames.HIDDEN);
};
