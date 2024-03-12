import AbstractComponent from 'app/component/AbstractComponent';
import M27CheckboxOption from 'app/component/molecule/m27-checkbox-option/M27CheckboxOption';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { DisposableManager } from 'seng-disposable-manager';
import { capitalizeFirstLetter } from 'app/util/capitalizeFirstLetter';
import { isOverflowing } from 'app/util/isOverflowing';
import { M27CheckboxOptionProps } from 'app/component/molecule/m27-checkbox-option/M27CheckboxOption.types';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import M27Template from 'app/component/molecule/m27-checkbox-option/m27-checkbox-option.hbs?include';
import A11Checkbox from 'app/component/atom/a11-checkbox/A11Checkbox';

export default class O80MultiselectDropdown extends AbstractComponent {
  public static readonly displayName: string = 'o80-multiselect-dropdown';
  private readonly pseudoSelect = this.getElement('[data-pseudo-select]');
  private readonly options = this.getElement('[data-options]');
  private readonly selectedOptionsContainer = this.getElement('[data-selected-options]');
  private readonly chevron = this.getElement('[data-chevron]');
  private readonly placeholder = this.getElement('[data-placeholder]');
  private checkboxDisposables = new DisposableManager();
  private observer: MutationObserver | null = null;
  public selectedOptions: Array<string> = [];
  private readonly optionsSelectedPlaceholder = this.element.dataset.optionsSelectedPlaceholder;

  public adopted() {
    this.addListenersToToggleMultiselect();

    this.addListenersToOptions();
  }

  private addListenersToToggleMultiselect() {
    if (this.pseudoSelect) {
      this.addDisposableEventListener(this.pseudoSelect, 'click', () => {
        this.element.classList.add(StateClassNames.ACTIVE);
        this.chevron && this.chevron.classList.add(StateClassNames.OPEN);
        this.options && this.options.classList.add(StateClassNames.OPEN);
        this.options?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
    this.addDisposableEventListener(window, 'click', (e) => {
      const target = (e.target as unknown) as HTMLElement;

      if (target !== this.element && !this.element.contains(target)) {
        this.element.classList.remove(StateClassNames.ACTIVE);
        this.chevron && this.chevron.classList.remove(StateClassNames.OPEN);
        this.options && this.options.classList.remove(StateClassNames.OPEN);
      }
    });
  }

  private addListenersToOptions() {
    this.checkboxDisposables.dispose();

    if (this.options) {
      const checkboxes = this.getElements<HTMLInputElement>('input', this.options);
      checkboxes.forEach((checkbox) => {
        this.addDisposableEventListener(
          checkbox,
          'change',
          () => {
            const option = checkbox.value;
            if (checkbox.checked) {
              this.addSelected(option);
            } else {
              this.removeSelected(option);
            }
            this.showSelectedOptions();
          },
          this.checkboxDisposables,
        );
      });
    }
  }

  public addOption(M27Data: M27CheckboxOptionProps) {
    const { value, id } = M27Data;

    if (!value || !id || !this.options) {
      throw new Error('Could not add new option to O80 instance');
    }
    const li = document.createElement('li');
    li.setAttribute('data-option-value', value);
    li.classList.add('o-multiselectDropdown__option');
    const M27CheckboxInstance = renderItem(li, M27Template, M27Data);
    M27CheckboxInstance.setAttribute(`data-${id}`, '');
    this.options.append(li);
  }

  public removeOption(valueOfOptionToRemove: string) {
    if (!this.options) {
      throw new Error('Could not remove options from O80 instance');
    }
    const options = this.getElements('[data-option-value]', this.options);

    options.forEach((option) => {
      const value = option.getAttribute('data-option-value');

      if (value === valueOfOptionToRemove) {
        this.options && this.options.removeChild(option);
      }
    });
  }

  public removeSelected(option: string) {
    this.selectedOptions = this.selectedOptions.filter(
      (selectedOption) => selectedOption !== option,
    );
  }

  public addSelected(option: string) {
    this.selectedOptions = [...this.selectedOptions, option];
  }

  public reset() {
    if (this.options) this.options.innerHTML = '';
    this.selectedOptions = [];
    this.showSelectedOptions();
  }

  public showSelectedOptions() {
    const selectedOptionsCapitalized = this.selectedOptions.map((option) =>
      capitalizeFirstLetter(option),
    );
    const areThereSelectedOptions = selectedOptionsCapitalized.length > 0;
    if (this.placeholder) {
      this.placeholder.style.display = areThereSelectedOptions ? 'none' : 'block';
    }
    if (this.selectedOptionsContainer) {
      this.selectedOptionsContainer.style.display = areThereSelectedOptions ? 'flex' : 'none';
      this.selectedOptionsContainer.innerText = areThereSelectedOptions
        ? selectedOptionsCapitalized.join(', ')
        : '';

      if (isOverflowing(this.selectedOptionsContainer)) {
        this.selectedOptionsContainer.innerText = `${selectedOptionsCapitalized.length} ${
          this.optionsSelectedPlaceholder ?? 'options selected'
        }`;
      }
    }
  }

  public setDefaultSelectedValue() {
    const checkbox = this.getElement<HTMLInputElement>(
      `[data-component="${A11Checkbox.displayName}"] input`,
    );

    if (checkbox) {
      checkbox.checked = true;
    }
  }

  public removeDefaultSelectedValue() {
    const checkboxes = this.getElements<HTMLInputElement>(
      `[data-component="${A11Checkbox.displayName}"] input`,
    );

    checkboxes.forEach((checkbox) => (checkbox.checked = false));

    this.selectedOptions = [];
    this.showSelectedOptions();
  }

  public setupMutationObserverForOptions() {
    const targetNode = this.options;
    const config = { attributes: false, childList: true, subtree: true };

    const callback: MutationCallback = (mutationList, observer) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const nodesAdded = Array.from(mutation.addedNodes) as Array<Element>;
          const nodesRemoved = Array.from(mutation.removedNodes) as Array<Element>;
          const includesCheckbox = (node: Element) => {
            if (
              node.getAttribute &&
              node.getAttribute('data-component') === M27CheckboxOption.displayName
            ) {
              return true;
            }

            return node.children && Array.from(node.children).some(includesCheckbox);
          };

          const shouldResetListeners =
            nodesAdded.some(includesCheckbox) || nodesRemoved.some(includesCheckbox);

          if (shouldResetListeners) {
            this.addListenersToOptions();
          }
        }
      });
    };

    if (targetNode) {
      this.observer = new MutationObserver(callback);
      this.observer.observe(targetNode, config);
    }
  }

  public dispose() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
