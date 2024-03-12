import AbstractComponent from 'app/component/AbstractComponent';
import { TweenLite } from 'gsap';
import { getComponentForElement } from 'muban-core';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import { addEventListener } from 'seng-disposable-event-listener';
import eases from '../../../animation/eases';
import { getAppComponent } from '../../../util/getElementComponent';
import TrackingEvent, { TrackingEventNames } from '../../../util/TrackingEvent';
import A18Recaptcha from '../../atom/a18-recaptcha/A18Recaptcha';
import O45FormResponse from './o45-form-response.hbs?include';
import { getValidationConstraints, validateField, validateForm } from './O45FormValidation';
import {
  FormErrorResponse,
  FormOptionGroup,
  FormTextField,
  Messages,
  ResponseData,
  ResponseMessage,
  ValidationConstraint,
} from './O45FormValidationTypes';
import { User } from '../../../data/interface/User';
import { createUserDataObject } from '../../../util/createUserDataObject';
import { post } from 'app/util/fetch/postRequest';
import { FetchError } from 'app/util/fetch/fetchError';
import O45FormEvent from './O45FormEvent';

export default class O45Form extends AbstractComponent {
  public static readonly displayName: string = 'o45-form';
  protected recaptchaComponent: A18Recaptcha | null = null;

  private readonly form = this.getElement<HTMLFormElement>('[data-form]');
  private readonly textFields = this.getElements<HTMLInputElement | HTMLTextAreaElement>(
    'input:not([type="hidden"])[data-validate], textarea[data-validate]',
  );
  private readonly dropDowns = this.getElements<HTMLSelectElement>('select[data-validate]');
  private readonly radiosAndCheckboxes = this.getElements<HTMLInputElement>(
    'input[type="checkbox"], input[type="radio"]',
  );
  private readonly fieldSets = this.getElements<HTMLFieldSetElement>(
    'fieldset.-radioGroup,fieldset.-checkboxGroup',
  );
  private readonly responseWrapper = this.getElement<HTMLDivElement>(
    '[data-form-response-wrapper]',
  );
  private submitButton = this.getElement<HTMLButtonElement>('[data-submit-button]');
  private readonly messages: Messages | null = this.element.dataset.messages
    ? JSON.parse(this.element.dataset.messages)
    : null;
  private readonly formErrors = this.getElements('[data-error-message]');

  private readonly intersectionObserver = new IntersectionObserver(this.onFormInView.bind(this), {
    threshold: 0.5,
  });

  private hasIntersected = false;

  constructor(el: HTMLElement) {
    super(el);

    this.recaptchaComponent = getComponentForElement<A18Recaptcha>(
      this.getElement(`[data-component="${A18Recaptcha.displayName}"]`)!,
    );

    TweenLite.set(this.responseWrapper, {
      autoAlpha: 0,
      height: 0,
    });

    this.toggleSubmitButtonDisabledStatus(true);
  }

  private toggleSubmitButtonDisabledStatus(isDisabled: boolean) {
    if (!this.submitButton) return;

    this.submitButton.disabled = isDisabled;
  }

  public adopted() {
    this.initValidation();

    this.intersectionObserver.observe(this.element);
  }

  private onFormInView(entries: ReadonlyArray<IntersectionObserverEntry>): void {
    if (entries[0].isIntersecting && !this.hasIntersected) {
      this.hasIntersected = true;

      TrackingEvent({
        event: TrackingEventNames.FORM_IMPRESSION,
        form: {
          titleInEnglish: this.form?.dataset.titleInEnglish || '',
          id: this.getElement('[name="form_id"]')?.getAttribute('value') || '',
        },
      });
    }
  }

  private initValidation() {
    if (!this.form) return;

    this.form.setAttribute('novalidate', '');

    const optionGroups = [...this.dropDowns, ...this.radiosAndCheckboxes] as Array<FormOptionGroup>;

    // validation constraints for optionGroups are coming from their field sets
    const validationConstraints = getValidationConstraints([
      ...this.dropDowns,
      ...this.fieldSets,
      ...this.textFields,
    ]);

    // blur and change validation
    this.textFields &&
      this.addEventListeners('blur', this.textFields, validationConstraints, this.formErrors);
    optionGroups &&
      this.addEventListeners('change', optionGroups, validationConstraints, this.formErrors);

    // submit validation
    this.disposables.add(
      addEventListener(this.form, 'submit', (event: Event) => this.submitForm(event)),
    );
  }

  private addEventListeners(
    listener: string,
    fields: ReadonlyArray<FormTextField> | ReadonlyArray<FormOptionGroup>,
    validationConstraints: ValidationConstraint,
    formErrors: ReadonlyArray<HTMLElement>,
  ) {
    fields.forEach((field: FormTextField | FormOptionGroup) => {
      this.addDisposableEventListener(field, listener, () => {
        validateField(field, validationConstraints, formErrors);

        const result = validateForm(this.form!, validationConstraints);

        if (!result) {
          this.toggleSubmitButtonDisabledStatus(false);
        } else {
          this.toggleSubmitButtonDisabledStatus(true);
        }
      });
    });
  }

  private async submitForm(event: Event): Promise<void> {
    // Always prevent submit to avoid sending GET requests to action
    event.preventDefault();

    if (!this.form || !this.responseWrapper || !this.messages || !this.recaptchaComponent) {
      return;
    }

    const formData = new FormData(this.form);

    const formID = <string>(
      this.getElement<HTMLInputElement>('[name="form_id"]')?.getAttribute('value')
    );
    const app = await getAppComponent();

    let responseData: ResponseData = {
      error: false,
      message: null,
    };

    let responseMessage: ResponseMessage | undefined = undefined;

    try {
      const [recaptchaResponse] = await Promise.all([
        this.recaptchaComponent.getResponse(),
        app.setLoadingState(true),
      ]);

      formData.set('g-recaptcha-response', recaptchaResponse);

      const fetchRequest = post(this.form.action, formData);

      const [response] = await Promise.all([
        fetchRequest.then((response) => response.json() as unknown as ResponseMessage),
        new Promise((resolve) => {
          TweenLite.to(this.responseWrapper, 0.5, {
            autoAlpha: 0,
            height: 0,
            ease: eases.VinnieInOut,
            onComplete: resolve,
          });
        }),
      ]);

      responseData = {
        error: response.status !== 200,
        message: response.status === 200 ? this.messages.success : this.messages.error,
      };

      responseMessage = {
        message: response.message,
        status: response.status,
      };
    } catch (err) {
      const response = this.onError(err);

      responseData = response.data;
      responseMessage = response.message;
    } finally {
      await app.setLoadingState(false);
      this.toggleSubmitButtonDisabledStatus(false);

      if (responseData) {
        const formResponseElement = renderItem(this.responseWrapper, O45FormResponse, responseData);
        !responseData.error &&
          this.dispatcher.dispatchEvent(new O45FormEvent(O45FormEvent.UPDATE, this));

        TweenLite.fromTo(
          this.responseWrapper,
          0.5,
          {
            height: 0,
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            height: formResponseElement.clientHeight,
            ease: eases.VinnieInOut,
          },
        );

        !responseData.error && this.form?.reset();
        this.toggleSubmitButtonDisabledStatus(true);
      }
    }

    const trackingErrorMessage =
      responseData.error && responseMessage ? responseMessage.message : null;

    const user: User = createUserDataObject(formData);

    TrackingEvent({
      event: TrackingEventNames.FORM_SUBMIT,
      form: {
        error: responseData.error,
        id: formID,
        errorMessage: trackingErrorMessage,
        response: responseMessage,
        titleInEnglish: this.form.dataset.titleInEnglish || '',
        user,
      },
    });
  }

  private onError(error: unknown): FormErrorResponse {
    if (!this.messages) {
      throw new Error('Please set form error and success messages');
    }

    const errorResponse = {
      data: {
        error: true,
        message: this.messages.error,
      },
      message: {
        status: 0,
        message: 'An unknown error has occurred',
      },
    };

    if (error instanceof FetchError) {
      errorResponse.message.status = error.status ?? 0;
      errorResponse.message.message = error.message ?? 'An unknown error has occurred';
      return errorResponse;
    } else {
      return errorResponse;
    }
  }

  public dispose() {
    super.dispose();

    this.intersectionObserver.disconnect();
  }
}
