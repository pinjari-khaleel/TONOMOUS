import AbstractComponent from 'app/component/AbstractComponent';
import { scrollIntoViewWithDelay } from './scrollIntoViewWithDelay';
import { M27CheckboxOptionProps } from 'app/component/molecule/m27-checkbox-option/M27CheckboxOption.types';
import { capitalizeFirstLetter } from '../capitalizeFirstLetter';
import O80MultiselectDropdown from 'app/component/organism/o80-multiselect-dropdown/O80MultiselectDropdown';

export const renderMultipleDropdownForMultipleChoice = (
  O80Instance: O80MultiselectDropdown,
  inputs: ReadonlyArray<HTMLInputElement>,
  parent: AbstractComponent,
  parentName: string,
) => {
  O80Instance.element.style.display = 'none';
  const pseudoSelect = O80Instance.getElement<HTMLElement>('[data-pseudo-select]');
  const fieldset = O80Instance.getElement<HTMLElement>('fieldset');
  if (!pseudoSelect || !fieldset) {
    throw new Error(`Required elements in ${parentName} not found`);
  }

  O80Instance.setupMutationObserverForOptions();

  let prevCheckedOptions = 0;
  let checkedOptions = 0;
  inputs.forEach((input) => {
    if (input) {
      parent.addDisposableEventListener(input, 'change', () => {
        let M27Data: M27CheckboxOptionProps = {};
        if (input.checked) {
          checkedOptions += 1;

          const inputValue = input.value;
          const fieldsetId = fieldset.id;

          M27Data = {
            checked: false,
            id: fieldsetId,
            name: fieldsetId,
            value: inputValue,
            required: false,
            label: capitalizeFirstLetter(inputValue),
          };

          O80Instance.addOption(M27Data);
        } else {
          checkedOptions -= 1;

          O80Instance.removeOption(input.value);
          O80Instance.removeSelected(input.value);
          O80Instance.showSelectedOptions();
        }

        if (checkedOptions > 1) {
          if (prevCheckedOptions === 1) {
            O80Instance.removeDefaultSelectedValue();
          }

          O80Instance.element.style.display = 'block';
          fieldset.removeAttribute('data-block-validation');

          scrollIntoViewWithDelay(pseudoSelect, 100);
        } else {
          // only option from parent set as default
          O80Instance.setDefaultSelectedValue();

          O80Instance.element.style.display = 'none';
          fieldset.setAttribute('data-block-validation', '');
        }
        prevCheckedOptions = checkedOptions;
      });
    } else {
      throw new Error(`Could not find input in ${parentName}`);
    }
  });

  return () => {
    O80Instance.reset();
    O80Instance.element.style.display = 'none';
    pseudoSelect.setAttribute('data-block-validation', '');
    checkedOptions = 0;
  };
};
