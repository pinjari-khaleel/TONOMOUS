export const getLuminance = (hexCode: string) => {
  hexCode = hexCode.replace('#', '');
  const r = parseInt(hexCode.substr(0, 2), 16);
  const g = parseInt(hexCode.substr(2, 2), 16);
  const b = parseInt(hexCode.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 / 255;
};
