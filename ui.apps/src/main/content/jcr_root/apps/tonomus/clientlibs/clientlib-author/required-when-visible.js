$(document).on("dialog-loaded", function () {
  (function (window, $) {
    'use strict';

    const CLASS_HIDE = 'hide',
        JS_TYPE_FUNCTION = 'function',
        SELECTOR_CHECKED_RADIO_ITEM = "coral-radio[checked]",
        SELECTOR_DROPDOWN = "coral-select",
        SELECTOR_DROPDOWN_SELECTED_ITEM = "coral-select-item[selected]",
        SELECTOR_FILEUPLOAD = 'coral-fileupload',
        SELECTOR_FILEREFERENCE_INPUT = 'input[data-cq-fileupload-parameter=filereference]',
        SELECTOR_RADIOGROUP = 'div.coral-RadioGroup';

    /**
     * Checks if the element, or it's parent has been hidden using dialog-show-hide.js
     *
     * @param {jQuery} $element coral element to check (jquery-wrapped)
     * @returns {Boolean}
     */
    function isHidden($element) {
      return $element.hasClass(CLASS_HIDE)
          || $element.closest('[data-showhide-target-value]').hasClass(CLASS_HIDE);
    }

    /**
     * Returns a real value of coral field.
     *
     * @param {jQuery} $element coral element to check (jquery-wrapped)
     */
    function getValue($element) {
      let value;
      // Default val() function
      if ($element.val && JS_TYPE_FUNCTION === typeof $element.val) {
        value = $element.val();
      }

      // Check other possible cases
      if (!value) {
        if ($element.is(SELECTOR_FILEUPLOAD)) {
          // Fileupload field workaround - look for hidden input field
          return $element.find(SELECTOR_FILEREFERENCE_INPUT).val();
        } else if ($element.is(SELECTOR_DROPDOWN)) {
          // Uninitialized combo box workaround - look for the selected element
          value = $element.find(SELECTOR_DROPDOWN_SELECTED_ITEM).val();
        } else if ($element.is(SELECTOR_RADIOGROUP)) {
          // Uninitialized radio group workaround - look for checked item
          value = $element.find(SELECTOR_CHECKED_RADIO_ITEM).attr('value');
        }
      }
      return value;
    }

    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
      selector: "[data-foundation-validation='required-when-visible']",
      validate: function (el) {
        let $el = $(el);
        if (!isHidden($el) && !getValue($el)) {
          return "This field is mandatory";
        }
      }
    });

  })(window, Granite.$);
});
