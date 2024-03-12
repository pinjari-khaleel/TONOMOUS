import AbstractComponent from 'app/component/AbstractComponent';
import { scrollIntoViewWithDelay } from './scrollIntoViewWithDelay';

export const renderDropdownForMultipleChoice = (
  selectContainer: HTMLElement,
  inputs: ReadonlyArray<HTMLInputElement>,
  parent: AbstractComponent,
  parentName: string,
) => {
  selectContainer.style.display = 'none';
  const select = selectContainer.querySelector('select');
  if (!select) {
    throw new Error(`Select element in ${parentName} not found`);
  }
  const selectOptions = select.options;

  clearAllOptions(selectOptions, select);

  let checkedOptions = 0;
  inputs.forEach((input) => {
    if (input) {
      parent.addDisposableEventListener(input, 'change', () => {
        if (input.checked) {
          checkedOptions += 1;
          const option = document.createElement('option');
          const value = input.value;
          option.value = value;
          option.text = `${value[0].toUpperCase()}${value.slice(1)}`;
          select.add(option);
        } else {
          checkedOptions -= 1;

          for (let i = 0; i < selectOptions.length; i++) {
            const option = selectOptions[i];
            if (option.value === input.value) {
              select?.removeChild(option);
            }
          }
        }

        if (checkedOptions > 1) {
          selectContainer.style.display = 'block';
          select.removeAttribute('data-block-validation');

          scrollIntoViewWithDelay(select, 100);
        } else {
          selectContainer.style.display = 'none';
          select.setAttribute('data-block-validation', '');
          select.value = '';
        }
      });
    } else {
      throw new Error(`Could not find input in ${parentName}`);
    }
  });

  return () => {
    clearAllOptions(selectOptions, select);
    selectContainer.style.display = 'none';
    select.setAttribute('data-block-validation', '');
    checkedOptions = 0;
  };
};

const clearAllOptions = (options: HTMLOptionsCollection, select: HTMLSelectElement) => {
  // must start iteration from the last index because
  // DOM rearranges select options when one is removed (one that is not at the end of array)
  for (let i = options.length - 1; i >= 0; i--) {
    const option = options[i];
    !option.selected && select?.removeChild(option);
  }
};
