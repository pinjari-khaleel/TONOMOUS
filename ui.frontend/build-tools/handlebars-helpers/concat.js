/**
 * Concatenates list of strings
 *
 * @return {string}
 */
module.exports = function (...args) {
  return args.filter((a) => typeof a === 'string' || typeof a === 'number').join('');
};
