export function toggleInert(element: HTMLElement, force?: boolean): void {
  const shouldInert = force === undefined ? !element.classList.contains('inert') : force;

  element.tabIndex = shouldInert ? -1 : 0;
  element.setAttribute('aria-hidden', String(shouldInert));
  element.classList.toggle('inert', shouldInert);
}
