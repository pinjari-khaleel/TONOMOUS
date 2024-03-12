module.exports = function (string) {
  if (string && typeof string === 'string') {
    return string.toLowerCase();
  }
  return '';
};
