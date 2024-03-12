export const getScrollParent = (node: HTMLElement): HTMLElement | null => {
  const overflowY = window.getComputedStyle(node).overflowY;
  const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

  if (!node || !node.parentElement) {
    return null;
  } else if (isScrollable && node.scrollHeight >= node.clientHeight) {
    return node;
  }

  return getScrollParent(node.parentElement);
};
