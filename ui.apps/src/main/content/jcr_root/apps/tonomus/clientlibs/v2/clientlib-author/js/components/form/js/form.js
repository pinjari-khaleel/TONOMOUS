(function($, channel, Coral) {
    "use strict";

    var EDIT_DIALOG_DROPDOWN = ".cmp-form-dropdown__editDialog";
    var DROPDOWN_REQUIRED = ".cmp-form-dropdown__required";
    var DROPDOWN_REQUIREDMESSAGE = ".cmp-form-dropdown__requiredmessage";

    /**
     * Toggles the display of the given element based on the actual and the expected values.
     * If the actualValue is equal to the expectedValue , then the element is shown,
     * otherwise the element is hidden.
     *
     * @param {HTMLElement} element The html element to show/hide.
     * @param {*} expectedValue The value to test against.
     * @param {*} actualValue The value to test.
     */
    function checkAndDisplay(element, expectedValue, actualValue) {
        if (expectedValue === actualValue) {
            element.show();
        } else {
            element.hide();
        }
    }    
    
    /**
     * Toggles the visibility of the required message input field based on the "required" input field.
     * If the "required" field is set, the required message field is shown,
     * otherwise it is hidden.
     *
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleRequiredMessage(dialog) {
        var component = dialog.find(DROPDOWN_REQUIRED)[0];
        var requiredMessage = dialog.find(DROPDOWN_REQUIREDMESSAGE);
        checkAndDisplay(requiredMessage,
            true,
            component.checked);
        component.on("change", function() {
            checkAndDisplay(requiredMessage,
                true,
                component.checked);
        });
    }

    /**
     * Initialise the conditional display of the various elements of the dialog.
     *
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function initialise(dialog) {
        dialog = $(dialog);
        handleRequiredMessage(dialog);
    }
    
    channel.on("foundation-contentloaded", function(e) {
        if ($(e.target).find(EDIT_DIALOG_DROPDOWN).length > 0) {
            Coral.commons.ready(e.target, function(component) {
                initialise(component);
            });
        }
    });
    
})(jQuery, jQuery(document), Coral);
