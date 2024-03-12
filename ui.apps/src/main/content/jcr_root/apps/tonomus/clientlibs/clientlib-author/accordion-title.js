/**
 * This script can be used to update the title of accordion item in dialogs' multifields.
 *
 *
 */
(function (document, $, moment) {
  "use strict";

  const
      ATTR_DISPLAY_DATE_FORMAT = "displayformat",
      DATE_DEFAULT_FORMAT = "YYYY-MM-DD",
      EMPTY = '',
      // "dialog-loaded" is not used to make it working for pages' properties editing
      EVENT_DIALOG_LOAD = 'foundation-contentloaded.accordion-title',
      JS_TYPE_FUNCTION = 'function',
      SELECTOR_ACCORDION_ITEM_LABEL = "coral-accordion-item-label",
      SELECTOR_ACCORDION_ITEM_TITLE_FIELD = ".accordion-multifield-item-title",
      SELECTOR_ACCORDION_MULTIFIELD_ITEMS = ".accordion-multifield-item",
      SELECTOR_CORAL_SELECT = "coral-select",
      SELECTOR_CORAL_SELECTED_ITEM = "coral-select-item[selected]",
      SELECTOR_DATE_FIELD = "coral-datepicker";

  /**
   * Extracts value or text from a coral field.
   *
   * @param $field the field to extract value
   * @returns {string} value or text
   */
  function extractValue($field) {
    if (!$field) {
      return EMPTY;
    }

    // For combo boxes return text of the selected item
    if ($field.is(SELECTOR_CORAL_SELECT)) {
      return $field.find(SELECTOR_CORAL_SELECTED_ITEM).text().trim();
    }

    // Result value
    let value;

    if ($field.val && JS_TYPE_FUNCTION === (typeof $field.val)) {
      value = $field.val();
    }
    if (!value && $field.getValue && JS_TYPE_FUNCTION === (typeof $field.getValue)) {
      value = $field.getValue();
    }
    if (!value && $field.value) {
      value = $field.value;
    }

    // For date fields return formatted display date
    if (value && $field.is(SELECTOR_DATE_FIELD)) {
      let dateValue = moment(value);
      if (dateValue.isValid()) {
        let format = $field.attr(ATTR_DISPLAY_DATE_FORMAT) || DATE_DEFAULT_FORMAT;
        value = dateValue.format(format);
      }
    }

    // Return text for other fields
    if (!value && $field.text && typeof $field.text === JS_TYPE_FUNCTION) {
      value = $field.text();
    }

    if (!value) {
      console.log("Accordion Title: Couldn't extract value from the field ");
      console.log($field);
      return EMPTY;
    }

    return value.trim();
  }

  $(document).off(EVENT_DIALOG_LOAD).on(EVENT_DIALOG_LOAD, function () {
    let accordionItems = document.querySelectorAll(SELECTOR_ACCORDION_MULTIFIELD_ITEMS);

    if (!accordionItems.length) {
      return;
    }

    Coral.commons.ready(accordionItems, function () {
      let processedFields = {};

      // Iterate in reverse order
      for (let i = accordionItems.length; i > 0; i--) {
        let accordionItem = accordionItems.item(i - 1),
            $accordionItem = $(accordionItem),
            $itemTitle = $accordionItem.find(SELECTOR_ACCORDION_ITEM_LABEL).first(),
            $itemFieldsToProduceTitle = $accordionItem.find(SELECTOR_ACCORDION_ITEM_TITLE_FIELD);

        // Title elements not found
        if (!$itemFieldsToProduceTitle.length) {
          continue;
        }

        /**
         * @type {array} array of field values to join
         */
        let newTitleArr = $.grep($itemFieldsToProduceTitle.map(function (idx, titleField) {
          let id = titleField.id || titleField.name;
          if (processedFields[id] === true) {
            // This title field has already been used for another accordion item
            return undefined;
          }
          // Add to processed
          processedFields[id] = true;

          return extractValue($(titleField));
        }).get(), Boolean);

        if (newTitleArr.length) {
          $itemTitle.text(newTitleArr.join(" - "));
        }
      }
    });
  });

})(document, Granite.$, moment);
