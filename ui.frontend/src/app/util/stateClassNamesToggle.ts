// TODO: Use this util in all components juggling StateClassnames

// Handles multiple StateClassNames in array of elements
// If an index is passed, it will add class to item from array that matches the index
// To remove classnames from all elements, do not pass the index
export const handleMultipleItemStateClassNames = (
  itemArray: readonly HTMLElement[],
  className: string,
  index?: number | null,
) => {
  itemArray.forEach((item, itemIndex) => {
    if (itemIndex !== index) {
      item.classList.remove(className);
    } else {
      item.classList.add(className);
    }
  });
};

// Simple class toggle util function
export const handleItemStateClassName = (item: HTMLElement, className: string) => {
  if (item.classList.contains(className)) {
    item.classList.remove(className);
  } else {
    item.classList.add(className);
  }
};
