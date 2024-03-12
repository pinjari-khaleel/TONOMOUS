/**
 * Replace anything within a string
 *
 * Example
 * ```typescript
 * const foo = 'Lorem {foo} dolor sit amet.';
 *
 * replaceInString(foo, { '{foo}': 'FOO' }) // Lorem FOO dolor sit amet.
 * ```
 *
 * @param input - The source string that contains the values to be replaced
 * @param data - An object that holds to be replaced values.
 */
export const replaceInString = (input: string, data: { [key: string]: string }) =>
  Object.entries(data).reduce(
    (output, [key, value]) => output.replace(new RegExp(key, 'g'), value),
    input,
  );

export const secondsToDurationFormat = (value: number) => {
  const days = Math.floor((value / 86400) & 365);
  const hours = Math.floor((value / 3600) % 24);
  const minutes = Math.floor((value / 60) % 60);
  const seconds = Math.floor(value % 60);

  return `P${days}DT${hours}H${minutes}M${seconds}S`;
};

export const secondsToTimeString = (seconds: number) =>
  [
    Math.floor((seconds / 86400) & 365), // Days
    Math.floor((seconds / 3600) % 24), // Hours
    Math.floor((seconds / 60) % 60), // Minutes
    Math.floor(seconds % 60), // Seconds
  ]
    .map((fragment) => fragment.toString().padStart(2, '0'))
    .join(':')
    .replace(/(00:)+/, '')
    .padStart(4, '0:');
