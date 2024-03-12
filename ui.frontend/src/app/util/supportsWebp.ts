export default function isWebpSupported(): boolean {
  const element = document.createElement('canvas');

  if (!!(element.getContext && element.getContext('2d'))) {
    // was able or not to get WebP representation
    return element.toDataURL('image/webp').indexOf('data:image/webp') == 0;
  } else {
    // very old browser like IE 8, canvas not supported
    return false;
  }
}
