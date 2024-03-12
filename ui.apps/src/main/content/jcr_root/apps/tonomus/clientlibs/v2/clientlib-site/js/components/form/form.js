var TONOMUS = TONOMUS || {};

TONOMUS.form = (function() {
    function Form(element) {

        const TEXT_REGEX = /^[^0-9!\/-:@\[\]`{-~<>()&%$#'"^|+=]+$/
        const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		this.initialize = function(element) {
            this.form = element;
            this.textFields = element.querySelectorAll('input:not([type="hidden"]), textarea') || [];
            this.dropdowns = element.querySelectorAll('select:not([disabled])') || [];
            this.formErrors = element.querySelectorAll('[data-error-message]') || [];
            this.formHelp = element.querySelectorAll('[data-help-message]') || [];
            this.validationConstraints = this.getValidationConstraints([
                ...this.textFields, ...this.dropdowns,
            ]);
            this.submitButton = element.querySelector('.cmp-form-button');
            this.validationResult = {};
            this.toggleSubmitButtonDisabledStatus(true);
            this.registerEventListeners();
        }


        this.registerEventListeners = () => {
            // blur and change validation
            this.textFields &&
            this.addEventListeners('blur', this.textFields, this.validationConstraints, this.formErrors);
            this.dropdowns &&
            this.addEventListeners('change', this.dropdowns, this.validationConstraints, this.formErrors);
            this.dropdowns?.forEach(function(element) {
                element.addEventListener("change", (event) => {
                    const option = event.target.options[event.target.selectedIndex]
                    const value = option.value;
                    const dynamicDropdowns = event.target.closest('.cmp-form').querySelectorAll('.cmp-form-options--dynamic')
                    dynamicDropdowns?.forEach(function(element) {
                        const select = element.querySelector('select');
                        if (select.id.includes(value)) {
                            select.disabled = false;
                            element.classList.add('cmp-form-options--show');
                        } else {
                            select.disabled = true;
                            element.classList.remove('cmp-form-options--show');
                        }
                    });
                });
            })
        }

        this.addEventListeners = (listener, fields, validationConstraints, formErrors) => {
            fields.forEach((field) => {
              field.addEventListener(listener, () => {
                this.validateField(field, validationConstraints, formErrors);
        
                const result = this.validateForm(this.form, validationConstraints);
                // toggle button form disabled
                if (this.isObjEmpty(result)) {
                  this.toggleSubmitButtonDisabledStatus(false);
                } else {
                  this.toggleSubmitButtonDisabledStatus(true);
                }
              });
            });
        }
          
        this.getValidationConstraints = (formFields) => {
              let constraints = {};
            
              formFields.forEach((field) => {
                if (!constraints[field.id]) {
                    constraints[field.id] = {};
                }
            
                if (field.required) {
                    const cmpField = field.closest('div');
                    constraints[field.id] = {presence: {message: cmpField.dataset?.cmpRequiredMessage || null}}; 
                } 
                constraints[field.id].type = field.type;
                
              });
              return constraints;
        };
          
        this.validateField = (
            formField,
            validationConstraints,
            formErrors
        ) => {
            let isFieldValid = false;          
            const { id, value } = formField;
            const attribute = { [id]: value.trim() || null };

            const result = this.validate(attribute, {
                [id]: validationConstraints[id],
            });

            this.toggleError(formErrors, formField, result);
          
            if (!result) isFieldValid = true;
          
            return isFieldValid;
        };

        this.validate = (attribute, constraints) => {
            for (attr in constraints) {
                const value = attribute[attr];
                const { [attr]: { type: fieldType } } = constraints;
                this.validationResult.hasOwnProperty(attr) && delete this.validationResult[attr];

                if (!value && constraints[attr].presence) {
                    const { [attr]: { presence: { message } } } = constraints;
                    this.validationResult[attr] = [message || 'This field is required.'];
                } else if (fieldType === 'text') {
                    !this.validateText(value) ? this.validationResult[attr] = ['Please only use letters'] : undefined;
                } else if (fieldType === 'email') {
                    !this.validateEmail(value) ? this.validationResult[attr] = ['Please enter valid email address'] : undefined;
                }
            }
            return this.validationResult
        }

        this.validateText = (text) => {
            const regex = TEXT_REGEX;
            return regex.test(text);
        };

        this.validateEmail = (email) => {
            const regex = EMAIL_REGEX;
            return regex.test(email);
        };
          
        this.toggleError = (formErrors, formField, validationResult) => {
            const fieldId = formField.id;
            const fieldErrorElement = [...formErrors].find((errorElement) => errorElement.dataset.for === fieldId);
            const cmpFieldWrapper = formField.closest('.cmp');
            const cmpIcon = cmpFieldWrapper.querySelector('.cmp-icon');
            const errorIcon = cmpFieldWrapper.querySelector('.cmp-icon__error-icon');
            const chevronIcon = cmpFieldWrapper.querySelector('.cmp-icon__chevron');

            if (!fieldErrorElement) return;
          
            if (!validationResult || !Object.keys(validationResult).includes(fieldId)) {
              formField.classList.remove('cmp-form-text__text--error');
              chevronIcon && cmpIcon.classList.add('cmp-icon__chevron');
              errorIcon && cmpIcon.classList.remove('cmp-icon__error-icon');
              return;
            }
          
            const [errorMessage] = validationResult[fieldId];
          
            if (errorMessage) {
              formField.classList.add('cmp-form-text__text--error');
              chevronIcon && cmpIcon.classList.remove('cmp-icon__chevron');
              cmpIcon.classList.add('cmp-icon__error-icon');
              fieldErrorElement.innerHTML = errorMessage;
            }
          };

        this.validateForm = (form, validationConstraints) => {
            const typesOfInputsToValidate = 'input:not([type="hidden"]), select:not([disabled]), textarea';
            const inputsToValidate = form.querySelectorAll(typesOfInputsToValidate);
            const inputValues = this.getValidationAttributes(...inputsToValidate);
            const result = this.validate(inputValues, validationConstraints);
      
            return result;
        };

        this.toggleSubmitButtonDisabledStatus = (isDisabled) => {
            if (!this.submitButton) return;
        
            this.submitButton.disabled = isDisabled;
        }

        this.getValidationAttributes = (...inputs) => {
            const isInput = (element) => element.nodeName === 'INPUT';
          
            const isSelect = (element) => element.nodeName === 'SELECT';
          
            const isTextArea = (element) => element.nodeName === 'TEXTAREA';
          
            return inputs.reduce((values, input) => {
              if (isInput(input) || isSelect(input) || isTextArea(input)) {
                const elementId = input.id;
          
                const elementValue = input.value ? input.value : null;
          
                return { ...values, [elementId]: elementValue };
              }
          
              return values;
            }, {});
        };

        this.isObjEmpty = (obj) => {
            return Object.keys(obj).length === 0;
        }

        this.initialize(element);
    }
    
    return function(element) {
        new Form(element);
    }

})();

window.addEventListener('load', () => {
    document.querySelectorAll('.cmp-form')?.forEach(function(element) {
        TONOMUS.form(element);
    });
});