import AbstractComponent from 'app/component/AbstractComponent';
import M30TextField from 'app/component/molecule/m30-text-field/M30TextField';
import M31DropdownField from 'app/component/molecule/m31-dropdown-field/M31DropdownField';
import { renderDropdownForMultipleChoice } from 'app/util/fieldsets/renderDropdownForMultipleChoice';
import { renderTextareaForOtherOption } from 'app/util/fieldsets/renderTextareaForOtherOption';
import { renderMultipleDropdownForMultipleChoice } from 'app/util/fieldsets/renderMultipleDropdownForMultipleChoice';
import O80MultiselectDropdown from '../o80-multiselect-dropdown/O80MultiselectDropdown';
import { getComponentForElement } from 'muban-core';

export default class O75CheckboxList extends AbstractComponent {
  public static readonly displayName: string = 'o75-checkbox-list';

  private readonly inputs = this.getElements<HTMLInputElement>('input[type="checkbox"]');
  private readonly optionalTextarea = this.getElement<HTMLTextAreaElement>(
    `[data-component=${M30TextField.displayName}]`,
  );

  private readonly optionalDropdown = this.getElement<HTMLElement>(
    `[data-component=${M31DropdownField.displayName}]`,
  );

  private readonly optionalMultipleDropdown = this.getElement<HTMLElement>(
    `[data-component=${O80MultiselectDropdown.displayName}]`,
  );

  private resetOptionalTextarea: null | (() => void) = null;
  private resetOptionalDropdown: null | (() => void) = null;
  private resetOptionalMultipleDropdown: null | (() => void) = null;

  constructor(el: HTMLElement) {
    super(el);

    if (!this.inputs.length) {
      throw new Error('Could not find any inputs');
    }

    if (this.optionalTextarea) {
      this.resetOptionalTextarea = renderTextareaForOtherOption(
        this.optionalTextarea,
        this.inputs,
        this,
        O75CheckboxList.displayName,
      );
    }

    if (this.optionalDropdown) {
      this.resetOptionalDropdown = renderDropdownForMultipleChoice(
        this.optionalDropdown,
        this.inputs,
        this,
        O75CheckboxList.displayName,
      );
    }

    if (this.optionalMultipleDropdown) {
      const O80Instance = getComponentForElement<O80MultiselectDropdown>(
        this.optionalMultipleDropdown,
      );
      this.resetOptionalMultipleDropdown = renderMultipleDropdownForMultipleChoice(
        O80Instance,
        this.inputs,
        this,
        O75CheckboxList.displayName,
      );
    }
  }

  public resetOptionalInputs() {
    if (this.resetOptionalDropdown) {
      this.resetOptionalDropdown();
    }
    if (this.resetOptionalTextarea) {
      this.resetOptionalTextarea();
    }
    if (this.resetOptionalMultipleDropdown) {
      this.resetOptionalMultipleDropdown();
    }
  }
}
