import { StateClassNames } from 'app/data/enum/StateClassNames';

export const setAsInitialised = (element: HTMLElement) => {
  // the timeout ensures that the class is added after the transitionIn
  // method of the element's component has run
  setTimeout(() => element.classList.add(StateClassNames.IS_INITIALISED), 0);
};
