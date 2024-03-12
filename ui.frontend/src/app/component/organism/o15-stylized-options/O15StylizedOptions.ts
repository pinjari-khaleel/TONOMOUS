import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import M30TextField from 'app/component/molecule/m30-text-field/M30TextField';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { handleMultipleItemStateClassNames } from 'app/util/stateClassNamesToggle';
import O15StylizedOptionsTransitionController from './O15StylizedOptionsTransitionController';
import { renderTextareaForOtherOption } from 'app/util/fieldsets/renderTextareaForOtherOption';
import { renderDropdownForMultipleChoice } from 'app/util/fieldsets/renderDropdownForMultipleChoice';
import M31DropdownField from 'app/component/molecule/m31-dropdown-field/M31DropdownField';
import O80MultiselectDropdown from '../o80-multiselect-dropdown/O80MultiselectDropdown';
import { getComponentForElement } from 'muban-core';
import { renderMultipleDropdownForMultipleChoice } from 'app/util/fieldsets/renderMultipleDropdownForMultipleChoice';

type InputEventExtended = InputEvent & {
  target: {
    checked: boolean;
  };
};
export default class O15StylizedOptions extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o15-stylized-options';

  public readonly transitionController: O15StylizedOptionsTransitionController;

  private readonly labels = this.getElements<HTMLLabelElement>('[data-label]');
  private readonly inputs = this.getElements<HTMLInputElement>('[data-input]');
  private isMultipleChoice = false;

  private readonly optionalTextarea = this.getElement<HTMLElement>(
    `[data-component=${M30TextField.displayName}]`,
  );

  private readonly optionalDropdown = this.getElement<HTMLElement>(
    `[data-component=${M31DropdownField.displayName}]`,
  );

  private readonly optionalMultipleDropdown = this.getElement<HTMLElement>(
    `[data-component=${O80MultiselectDropdown.displayName}]`,
  );

  private resetOptionalMultipleDropdown: null | (() => void) = null;
  private resetOptionalTextarea: null | (() => void) = null;
  private resetOptionalDropdown: null | (() => void) = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O15StylizedOptionsTransitionController(this);

    if (!this.inputs.length) {
      throw new Error('Could not find any inputs');
    }

    if (this.inputs[0].type === 'checkbox') {
      this.isMultipleChoice = true;
    }
    this.addEventListeners();

    if (this.optionalTextarea) {
      const resetOptionalTextArea = renderTextareaForOtherOption(
        this.optionalTextarea,
        this.inputs,
        this,
        this.displayName,
      );

      this.resetOptionalTextarea = resetOptionalTextArea;
    }

    if (this.optionalDropdown) {
      const resetOptionalDropdown = renderDropdownForMultipleChoice(
        this.optionalDropdown,
        this.inputs,
        this,
        this.displayName,
      );

      this.resetOptionalDropdown = resetOptionalDropdown;
    }

    if (this.optionalMultipleDropdown) {
      const O80Instance = getComponentForElement<O80MultiselectDropdown>(
        this.optionalMultipleDropdown,
      );
      this.resetOptionalMultipleDropdown = renderMultipleDropdownForMultipleChoice(
        O80Instance,
        this.inputs,
        this,
        this.displayName,
      );
    }
  }

  public resetOptionalInputs() {
    this.clearCheckedClassnames();
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

  private addEventListeners(): void {
    this.inputs.forEach((input, index) => {
      if (input) {
        this.addDisposableEventListener(input, 'change', (event: InputEventExtended) =>
          this.isMultipleChoice
            ? this.onMultipleChoiceInputChange(event, index)
            : this.onSingleChoiceInputChange(event, index),
        );
      } else {
        throw new Error('Could not find input in o15');
      }
    });
  }

  private onMultipleChoiceInputChange(event: InputEventExtended, index: number): void {
    const label = this.labels[index];
    if (event.target) {
      label.classList.toggle(StateClassNames.CHECKED, event.target.checked);
    } else {
      throw new Error('Could not locate event target input in o15');
    }
  }

  private onSingleChoiceInputChange(event: InputEventExtended, index: number): void {
    if (event.target.checked) {
      handleMultipleItemStateClassNames(this.labels, StateClassNames.CHECKED, index);
    } else {
      throw new Error('Could not locate event target input in o15');
    }
  }

  private clearCheckedClassnames() {
    this.labels.forEach((label) => label.classList.remove(StateClassNames.CHECKED));
  }
}
