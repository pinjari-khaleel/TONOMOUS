import AbstractComponent from 'app/component/AbstractComponent';
import { scrollIntoViewWithDelay } from './scrollIntoViewWithDelay';

export const renderTextareaForOtherOption = (
  textareaContainer: HTMLElement,
  inputs: ReadonlyArray<HTMLInputElement>,
  parent: AbstractComponent,
  parentName: string,
) => {
  textareaContainer.style.display = 'none';
  const textareaElement = textareaContainer.querySelector('textarea');
  if (!textareaElement) throw new Error('Could not find textarea element');

  inputs.forEach((input) => {
    if (input) {
      parent.addDisposableEventListener(input, 'change', () =>
        toggleOptionalTextareaDisplayAndValidation(input),
      );
    } else {
      throw new Error(`Could not find input in ${parentName}`);
    }
  });

  const toggleOptionalTextareaDisplayAndValidation = (input: HTMLInputElement) => {
    // handling radio list fieldset organisms

    if (input.type === 'radio') {
      if (input.value === 'other') {
        enableTextarea();
      } else {
        disableTextarea();
      }
    }

    // handling checkbox list fieldset organisms
    if (input.type === 'checkbox') {
      if (input.value === 'other') {
        if (textareaContainer.style.display === 'none') {
          enableTextarea();
        } else {
          disableTextarea();
        }
      }
    }
  };

  const enableTextarea = () => {
    textareaContainer.style.display = 'block';
    textareaElement.removeAttribute('data-block-validation');
    textareaElement.removeAttribute('disabled');

    scrollIntoViewWithDelay(textareaElement, 100);
  };

  const disableTextarea = () => {
    textareaContainer.style.display = 'none';
    textareaElement.setAttribute('data-block-validation', '');
    textareaElement.setAttribute('disabled', '');
  };

  return () => {
    disableTextarea();
  };
};
