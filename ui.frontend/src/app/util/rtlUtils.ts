const htmlAttribute = document.documentElement.getAttribute('dir');
const appElement = document.body.querySelector(`[data-component="app-root"]`);

export const IS_RTL = htmlAttribute === 'rtl' || appElement?.getAttribute('dir') === 'rtl';

/**
 * Simple util that either checks the HTML attribute or the app-root attribute.
 */
export const isRtl = (): boolean => {
  const htmlAttribute = document.documentElement.getAttribute('dir');
  const appElement = document.body.querySelector(`[data-component="app-root"]`);

  return htmlAttribute === 'rtl' || appElement?.getAttribute('dir') === 'rtl';
};

/**
 * Util that returns 1 or -1 depending on if the page is set to RTL reading mode. Useful in animations to modify, for example, the X axis
 * */
export const rtlModifier = (): 1 | -1 => (isRtl() ? -1 : 1);
