export const isIphoneOrIpod = () =>
  ['iPhone Simulator', 'iPod Simulator', 'iPhone', 'iPod'].includes(navigator.platform);

export const isSafari = () => !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

export const isIpad = () =>
  ['iPad Simulator', 'iPad'].includes(navigator.platform) ||
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
