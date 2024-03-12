import { validate } from 'validate.js';
import {
  FormField,
  ValidationAttribute,
  ValidationConstraint,
  ValidationResult,
} from './O45FormValidationTypes';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { ValidationType } from '../../../data/type/Validation.types';

export const getValidationConstraints = (
  formFields: ReadonlyArray<FormField>,
  step?: number,
  subStep?: number,
): Record<string, ValidationConstraint> => {
  let constraints: Record<string, ValidationConstraint> = {};

  if (step) {
    const subStepIdentifier = subStep ? `-${subStep}` : '';
    const constraintKey = `step-${step}${subStepIdentifier}`;
    constraints[constraintKey] = {};
  }

  formFields.forEach((field) => {
    const { id, dataset } = field;

    if (!dataset.validate) {
      return;
    }

    const constraint = JSON.parse(dataset.validate);

    if (subStep) {
      constraints[`step-${step}-${subStep}`][id] = constraint;
    } else if (step) {
      constraints[`step-${step}`][id] = constraint;
    } else {
      constraints[id] = constraint;
    }
  });

  return constraints;
};

export const validateField = (
  formField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  validationConstraints: Record<string, ValidationType>,
  formErrors: ReadonlyArray<HTMLElement>,
): boolean => {
  let isFieldValid = false;

  const { id, value } = formField;
  const attribute: ValidationAttribute = { [id]: value || null };

  const result: ValidationResult = validate(attribute, {
    [id]: validationConstraints[id],
  });

  toggleError(formErrors, formField, result);

  if (!result) isFieldValid = true;

  return isFieldValid;
};

export const validateForm = (
  form: HTMLFormElement,
  validationConstraints: ValidationConstraint,
): ValidationResult => {
  const typesOfInputsToValidate =
    'input[data-validate], fieldset[data-validate], select[data-validate], textarea[data-validate]';
  const inputsToValidate = form.querySelectorAll<FormField>(typesOfInputsToValidate);
  const inputValues = getValidationAttributes(...inputsToValidate);

  const result: ValidationResult = validate(inputValues, validationConstraints);

  return result;
};

export const toggleFormErrors = (
  form: HTMLFormElement,
  result: ValidationResult,
  formErrors: ReadonlyArray<HTMLElement>,
) => {
  if (result) {
    for (const [key, value] of Object.entries(result)) {
      const fieldElement = form.querySelector(`[data-${key}]`);
      const fieldErrorElement = formErrors.find((errorElement) => errorElement.dataset.for === key);

      if (fieldElement && fieldErrorElement) {
        fieldElement.classList.add(StateClassNames.HAS_ERROR);
        fieldErrorElement.style.display = 'block';
        fieldErrorElement.style.visibility = 'visible';
        fieldErrorElement.style.margin = `initial`;
        fieldErrorElement.innerText = value[0];
      }
    }
  } else {
    formErrors.forEach((error) => {
      error.style.margin = `-${error.clientHeight}px 0px 0px 0px`;
      error.style.visibility = 'hidden';
    });
  }
};

export const toggleError = (
  formErrors: ReadonlyArray<HTMLElement>,
  formField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFieldSetElement,
  validationResult: ValidationResult,
): void => {
  const fieldId = formField.id;

  const fieldErrorElement = formErrors.find((errorElement) => errorElement.dataset.for === fieldId);

  if (!fieldErrorElement) return;

  if (!validationResult || !Object.keys(validationResult).includes(fieldId)) {
    formField.classList.remove(StateClassNames.HAS_ERROR);
    fieldErrorElement.style.display = 'none';
    return;
  }

  const [errorMessage] = validationResult[fieldId];

  if (errorMessage) {
    formField.classList.add(StateClassNames.HAS_ERROR);
    fieldErrorElement.style.display = 'block';
    fieldErrorElement.innerHTML = errorMessage;
  }
};

type ValidationAttributes = {
  string: string | null;
};

const getValidationAttributes = (...inputs: Array<FormField>) => {
  const isInput = (element: HTMLElement): element is HTMLInputElement =>
    element.nodeName === 'INPUT';

  const isSelect = (element: HTMLElement): element is HTMLSelectElement =>
    element.nodeName === 'SELECT';

  const isFieldSet = (element: HTMLElement): element is HTMLFieldSetElement =>
    element.nodeName === 'FIELDSET';

  const isTextArea = (element: HTMLElement): element is HTMLTextAreaElement =>
    element.nodeName === 'TEXTAREA';

  return inputs.reduce((values, input) => {
    if (isInput(input) || isSelect(input) || isTextArea(input)) {
      const elementId = input.id;

      const elementValue = input.value ? input.value : null;

      return { ...values, [elementId]: elementValue };
    } else if (isFieldSet(input)) {
      const fieldSetId = input.id;

      const fieldSetInputs = input.querySelectorAll(`[data-${fieldSetId}]`) as NodeListOf<
        HTMLInputElement
      >;

      const userChoice = Array.from(fieldSetInputs).find((input) => input.checked);

      return {
        ...values,

        [fieldSetId]: userChoice?.value || null,
      };
    }

    return values;
  }, {} as ValidationAttributes);
};
