import { StateClassNames } from 'app/data/enum/StateClassNames';

export const controlsStateToggle = (
  activeIndex: number,
  items: number,
  nextControl: HTMLElement | null,
  prevControl: HTMLElement | null,
) => {
  activeIndex === items - 1
    ? nextControl?.classList.add(StateClassNames.DISABLED)
    : nextControl?.classList.remove(StateClassNames.DISABLED);
  activeIndex === 0
    ? prevControl?.classList.add(StateClassNames.DISABLED)
    : prevControl?.classList.remove(StateClassNames.DISABLED);
};
