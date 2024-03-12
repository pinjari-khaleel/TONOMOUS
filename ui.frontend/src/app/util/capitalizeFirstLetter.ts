export const capitalizeFirstLetter = (string: string, locale?: string) => {
  if (!locale) {
    const lang = document.querySelector('html')?.getAttribute('lang');

    locale = lang ? lang : 'en';
  }

  const [first, ...rest] = string;

  return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('');
};
