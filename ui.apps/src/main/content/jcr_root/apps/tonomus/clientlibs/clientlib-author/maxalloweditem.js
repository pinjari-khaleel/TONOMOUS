/**
 * Script can be used to limit the number of items in multifield.
 * Usage:
 * Add below property to node of resourcetype multifield (granite/ui/components/coral/foundation/form/multifield)
 * validation (type: string) : multifield-max-{allowedItems}
 *
 * Example: validation (string) : multifield-max-2  (will allow 2 items in multifield)
 *
 * Another variant is added for min/max validation (to validate both on the same multifield).
 * Just add to coral multifield min, max as data attributes:
 * <pre>
 *   <granite:data
 *     jcr:primaryType="nt:unstructured"
 *     min="1"
 *     max="5"/>
 * </pre>
 *
 **/
$(document).on("dialog-loaded", function () {

  (function (window, $, undefined) {
    'use strict';

    /**
     * Validation for minimum & maximum amount of items in the multifield.
     */
    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
      selector: "coral-multifield",
      validate: function (el) {
        var data = el.dataset,
            min = data && data["min"],
            max = data && data["max"],
            totalPanels = el.items && el.items.length;

        if (min && min > 0 && totalPanels < min) {
          // items added are more than allowed, return error
          return "Minimum numbers of items required are: " + min;
        }

        if (max && max > 0 && totalPanels > max) {
          return "Maximum numbers of items allowed are: " + max;
        }
      }
    });

    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
      // check elements that has attribute data-foundation-validation with value starting with "multifield-max"
      selector: "[data-foundation-validation^='multifield-max']",
      validate: function (el) {
        // parse the max number from the attribute value, the value maybe something like "multifield-max-6"
        var validationName = el.getAttribute("data-validation")
        var max = validationName.replace("multifield-max-", "");
        max = parseInt(max);
        // el here is a coral-multifield element
        if (el.items.length > max) {
          // items added are more than allowed, return error
          return "Max allowed items is " + max;
        }
      }
    });
    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
      selector: "[data-foundation-validation^='text']",
      validate: function (el) {
        var regex_pattern = /^(?!.*<[^>]+>).*/;
        var error_message = "HTML tags are not allowed here.";
        var result = el.value.match(regex_pattern);

        if (result === null) {
          return error_message;
        }
      }
    });
    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
      selector: "[data-foundation-validation^='heading-text']",
      validate: function (el) {
        var result = el.value.match(/<(?!\/br|br|\/span|span|\/strong|strong|\/em|em\s*\/?)[^>]+>/g);
        var error_message = "&lt;span&gt;, &lt;strong&gt;, &lt;em&gt; and &lt;br/&gt; tags only allowed here.";
        if (result != null) {
          return error_message;
        }
      }
    });
  })(window, Granite.$);
});
