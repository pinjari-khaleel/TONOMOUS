/**
 * # Dialog Show-Hide
 * _(file: dialog-show-hide.js)_
 *
 *
 * Additional client library for dropdown/select, radio etc. components.
 * It enabled hiding / unhiding of other components based on the selection made in the
 * dropdown/select.
 *
 * Was adapted from OOTB dropdownshowhide.js file
 *     /libs/cq/gui/components/authoring/dialog/dropdownshowhide/clientlibs/dropdownshowhide
 *
 * ## How to use:
 *
 * - add class `js-dialog-showhide` to dropdown(select)/radiogroup etc. element
 * - add data attribute `showhide-target` to the dropdown/radiogroup element, value should be a
 *   selector, usually a specific class name, to find all possible target elements that must be
 *   shown/hidden
 * - add the same target class to each target component that must be shown/hidden
 * - add attribute `showhide-target-value` to each target component, the value of the attribute
 *   should equal to the value of select (radio) option that will unhide this element.
 *
 * ---
 *
 * **To switch from AEM OOB version to this one, just replace dialog' classes from
 * "cq-dialog-dropdown-showhide" to "js-dialog-showhide", data attribute name from
 * "cq-dialog-dropdown-showhide-target" to "showhide-target" and data attribute name
 * "showhidetargetvalue" to showhide-target-value.**
 *
 *  ---
 *
 * ### Configuration samples
 *
 *  <pre>
 *    <!-- Coral 3 -->
 *    <selection
 *         jcr:primaryType="nt:unstructured"
 *         sling:resourceType="granite/ui/components/coral/foundation/form/select"
 *         fieldLabel="Selection"
 *         granite:class="js-dialog-showhide"
 *         name="./selection">
 *         <granite:data
 *             jcr:primaryType="nt:unstructured"
 *             showhide-target=".target-class-to-hide"/>
 *         <items jcr:primaryType="nt:unstructured">
 *             <image
 *                 jcr:primaryType="nt:unstructured"
 *                 text="Option 1"
 *                 value="value1"/>
 *             <video
 *                 jcr:primaryType="nt:unstructured"
 *                 text="Option 2"
 *                 value="value2"/>
 *         </items>
 *     </selection>
 *     <!-- This element is displayed only when `Option 2` is selected in a combobox -->
 *     <some-element
 *         jcr:primaryType="nt:unstructured"
 *         jcr:title="Other element"
 *         granite:class="target-class-to-hide hide"
 *         sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
 *         fieldLabel="Some text field"
 *         name="./text">
 *         <granite:data
 *             jcr:primaryType="nt:unstructured"
 *             showhide-target-value="value2"/>
 *     </some-element>
 *  </pre>
 *
 *  <pre>
 *     <!-- Coral 2 -->
 *     <selection
 *         jcr:primaryType="nt:unstructured"
 *         sling:resourceType="granite/ui/components/foundation/form/select"
 *         fieldLabel="Selection"
 *         class="js-dialog-showhide"
 *         showhide-target=".target-class-to-hide"
 *         name="./selection">
 *         <items jcr:primaryType="nt:unstructured">
 *             <image
 *                 jcr:primaryType="nt:unstructured"
 *                 text="Option 1"
 *                 value="value1"/>
 *             <video
 *                 jcr:primaryType="nt:unstructured"
 *                 text="Option 2"
 *                 value="value2"/>
 *         </items>
 *     </selection>
 *     <!-- This element is displayed only when `Option 2` is selected in a combobox -->
 *     <some-element
 *         jcr:primaryType="nt:unstructured"
 *         jcr:title="Some text field"
 *         showhide-target-value="value2"
 *         class="target-class-to-hide hide"
 *         sling:resourceType="granite/ui/components/foundation/form/textfield"/>
 *  </pre>
 *
 * @author yuriy.shestakov@mediamonks.com
 */
(function (document, $) {
  "use strict";

  const
      ATTR_ARIA_LABELLED_BY = 'aria-labelledby',
      EVENT_DIALOG_LOAD = 'foundation-contentloaded.showhide',
      EVENT_CHANGE = 'change',
      EVENT_SELECTED = 'selected',
      EVENT_TYPE_LOAD = 'load',
      /** Class for the dialog to add to switcher dialog elements */
      CLASS_SHOW_HIDE = 'js-dialog-showhide',
      /** Class for hiding an element */
      CLASS_HIDE = 'hide',
      /** data-showhide-target key */
      DATA_KEY_SHOWHIDE_TARGET = 'showhide-target',
      /** data-showhide-target-value key */
      DATA_KEY_SHOWHIDE_TARGET_VALUE = 'showhide-target-value',
      SELECTOR_ACCORDION_CONTENT = '.coral3-Accordion-content',
      SELECTOR_ACCORDION_ITEM_CONTENT = 'coral-accordion-item-content',
      SELECTOR_ACCORDION_ITEM_HEADING = '.coral3-Accordion-itemHeading',
      SELECTOR_CHECKED_RADIO_ITEM = "coral-radio[checked]",
      SELECTOR_CORAL2_CHECKED_RADIO_BUTTON = 'input.coral-Radio-input:checked',
      SELECTOR_FIELD_WRAPPER = '.coral-Form-fieldwrapper',
      SELECTOR_HIDDEN = '.' + CLASS_HIDE,
      SELECTOR_DROPDOWN = "coral-select",
      SELECTOR_DROPDOWN_SELECTED_ITEM = "coral-select-item[selected]",
      SELECTOR_PANEL = 'coral-panel',
      SELECTOR_TAB = 'coral-tab',
      SELECTOR_TAB_LIST = 'coral-tablist',
      SELECTOR_TAB_VIEW = 'coral-tabview',
      SELECTOR_MULTIFIELD_ITEM = 'coral-Multifield-item',
      SELECTOR_RADIOGROUP = 'div.coral-RadioGroup',
      SELECTOR_SHOWHIDE_COMPONENT = '.' + CLASS_SHOW_HIDE,
      CONTAINER_SELECTORS = 'coral-accordion, .coral-Form-fieldset, .coral-Well, '
          + SELECTOR_PANEL,
      JS_TYPE_FUNCTION = 'function',
      JS_TYPE_OBJECT = 'object',
      REGEXP_CORAL3 = /^coral-/i;

  var isMainDocumentProcessed = false,
      registeredShowHideElements = [];

  // When dialog gets injected
  $(document).off(EVENT_DIALOG_LOAD).on(EVENT_DIALOG_LOAD, function (eventObject) {
    var loadedContainerElement = eventObject.target || this;

    // Don't process main document twice (this event can be triggered twice in coral).
    if (loadedContainerElement === document) {
      if (isMainDocumentProcessed) {
        return;
      }

      isMainDocumentProcessed = true;
    }

    attachListeners(eventObject.target);
  });


  function attachListeners(context) {
    var $switcherFields = $(SELECTOR_SHOWHIDE_COMPONENT, context);

    // If we already registered show-hide items in this dialog, we should re-call them here as the
    // DOM is updated
    for (const $savedSwitcherField of registeredShowHideElements) {
      showHideHandler.apply($savedSwitcherField);
    }

    $switcherFields.each(function (i, coralField) {
      var $coralField = $(coralField);

      // Check element tag starts with `<coral-`
      if (REGEXP_CORAL3.test(coralField.nodeName)) {
        // Handle Coral 3 element

        Coral.commons.ready(coralField, function (initializedElement) {
          // If there is already an initial value make sure the corresponding target element becomes
          // visible
          showHideHandler.apply(initializedElement);
          // Attach listener
          initializedElement.on(EVENT_CHANGE, showHideHandler);
        });

      } else if ($coralField.is(SELECTOR_RADIOGROUP)) {
        // Radio Group workaround - element has class `coral-RadioGroup` and contains several
        // <coral-radio> elements

        // If there is already an initial value make sure the according target element becomes
        // visible
        showHideHandler.apply($coralField);
        // Attach listener
        $coralField.on(EVENT_CHANGE, showHideHandler);

      } else {
        // Handle Coral2 based element

        console.log('SHOW/HIDE: Old versions of Coral components are not entirely supported and' +
            ' may work improperly. Use Granite Coral 3 instead. Element:');
        console.log(coralField);

        // If there is already an init шal value make sure the according target element becomes
        // visible
        showHideHandler.apply($coralField);
        // Attach listener
        $coralField.on(EVENT_SELECTED, showHideHandler);
      }

      // Add to list for observer - solution for multifields (to show/hide multifield item's child
      // elements when the item is added).
      registeredShowHideElements.push($coralField);
    });
  }

  function showHideHandler(event) {
    var $element = $(this),
        targetSelector,
        targetValue;

    // get value to show
    targetValue = extractValueFromEvent(event);
    if (!targetValue) {
      targetValue = extractValueFromElement($element);
    }

    // get the selector to find the target elements, it's stored as data-showhide-target attribute
    targetSelector = $element.data(DATA_KEY_SHOWHIDE_TARGET);

    processShowHide($element, targetSelector, targetValue);
  }

  /**
   * Tries extract value from event
   * @param event jQuery / Granite UI event object
   * @returns {String|undefined} target value
   */
  function extractValueFromEvent(event) {
    if (!event || (event.type && event.type === EVENT_TYPE_LOAD)) {
      // Skip load events
      return;
    }

    var value;

    // For dropdowns (coral select) we can get the 'event.selected' value from the select event
    value = event.selected;

    // For radio buttons we can get the value directly from event's target from the change event
    if (!value && event.type === EVENT_CHANGE && event.target
        && $(event.target).is(SELECTOR_CHECKED_RADIO_ITEM)) {
      value = event.target.value
    }

    return value;
  }

  function extractValueFromElement($element) {
    var value,
        isCheck = $element.is("coral-checkbox, coral-radio, coral-switch");

    // Checkbox / radio button workaround, especially when the 'uncheckedValue' is set
    if (isCheck && $element.length && !$element[0].checked) {
      // Look for unchecked value
      let fieldName = $element.attr('name');
      if (fieldName) {
        var $uncheckedEl = $element.closest(SELECTOR_FIELD_WRAPPER)
            .find('[name="' + fieldName + '@DefaultValue"]');
        if ($uncheckedEl.length) {
          return extractValueFromElement($uncheckedEl);
        }
      }

      return null;
    }

    if ($element.value) {
      value = $element.value;
    } else if ($element.val && JS_TYPE_FUNCTION === (typeof $element.val)) {
      value = $element.val();
    } else if ($element.getValue && JS_TYPE_FUNCTION === (typeof $element.getValue)) {
      value = $element.getValue();
    } else if ($element.selectedItem && JS_TYPE_OBJECT === (typeof $element.selectedItem)) {
      value = $element.selectedItem.value;
    }

    if (!value) {
      if ($element.is(SELECTOR_DROPDOWN)) {
        // Uninitialized combo box workaround - look for selected element
        value = $element.find(SELECTOR_DROPDOWN_SELECTED_ITEM).val();
      } else if ($element.is(SELECTOR_RADIOGROUP)) {
        // Uninitialized radio group workaround - look or checked item
        value = $element.find(SELECTOR_CHECKED_RADIO_ITEM).attr('value');
      } else {
        // Coral 2 Radio Group workaround (looks for the input field that stores selected value)
        var $radioInputField = $element.find(SELECTOR_CORAL2_CHECKED_RADIO_BUTTON);
        if ($radioInputField.length) {
          return extractValueFromElement($radioInputField);
        }
      }
    }

    if (!value) {
      if (value === '') {
        console.log('SHOW/HIDE: Empty value "" will be used for show/hide functionality');
      } else {
        console.log('SHOW/HIDE: Couldn\'t extract value to show from the component ');
        console.log($element);
      }
    }

    return value;
  }

  /**
   * Function checks the jQuery object and hides/un-hides it and its parent field wrapper or other
   * containers when necessary.
   *
   * @param {Object} $targetToHide jquery object that needs to be processed
   * @param {Boolean} hide true if element must be hidden, false to un-hide it
   */
  function showHideElement($targetToHide, hide) {
    if (!$targetToHide) {
      console.log('SHOW/HIDE: Incorrect $targetToHide value');
      return;
    }

    // Special checking for some container elements (accordion panels and tabs) to hide also title

    const $firstParent = $targetToHide.parent();
    if ($firstParent.is(SELECTOR_ACCORDION_ITEM_CONTENT)) {
      // The container is accordion panel - hide accordion parent element and the heading div
      let $accordionItemHeading = $firstParent.parent(SELECTOR_ACCORDION_CONTENT)
          .prev(SELECTOR_ACCORDION_ITEM_HEADING);
      if (hide) {
        $firstParent.addClass(CLASS_HIDE);
        $accordionItemHeading.addClass(CLASS_HIDE);
      } else {
        $firstParent.removeClass(CLASS_HIDE);
        $accordionItemHeading.removeClass(CLASS_HIDE);
      }

      // Stop processing
      return;
    }

    const $coralPanel = $firstParent.parent(SELECTOR_PANEL),
        $tabView = $coralPanel.closest(SELECTOR_TAB_VIEW);
    if ($tabView.length) {
      // The element to be hidden is tab panel
      const coralTabId = $coralPanel.attr(ATTR_ARIA_LABELLED_BY),
          $tabTitlePanel = coralTabId &&
              $tabView.find(SELECTOR_TAB_LIST + '>' + SELECTOR_TAB + '[id=' + coralTabId + ']');

      if (coralTabId && $tabTitlePanel && $tabTitlePanel.length) {
        // Show hide only if we found the corresponding Tab title div to hide, otherwise do nothing
        if (hide) {
          $coralPanel.addClass(CLASS_HIDE);
          $tabTitlePanel.addClass(CLASS_HIDE);
        } else {
          $coralPanel.removeClass(CLASS_HIDE);
          $tabTitlePanel.removeClass(CLASS_HIDE);
        }
      }

      // There's no attribute aria-labelledby if Coral is not processed this div for now, so
      // it will be checked on the next foundation-contentloaded iteration

      // Stop processing
      return;
    }
    // Not accordion nor tab - usual processing

    // Hide or show the target
    if (hide) {
      $targetToHide.addClass(CLASS_HIDE);
    } else {
      $targetToHide.removeClass(CLASS_HIDE);
    }

    if (!$targetToHide.is(CONTAINER_SELECTORS)) {
      // Hide the target field wrapper. Thus, hiding label, quick tip etc.
      // Additional checking not to hide fields that are already wrappers
      // (like granite/ui/components/coral/foundation/form/fieldset or
      // granite/ui/components/coral/foundation/well)
      if (hide) {
        $targetToHide.closest(SELECTOR_FIELD_WRAPPER).addClass(CLASS_HIDE);
      } else {
        $targetToHide.closest(SELECTOR_FIELD_WRAPPER).removeClass(CLASS_HIDE);
      }
    }
  }

  function processShowHide($element, targetSelector, targetValue) {
    if (!targetSelector) {
      console.log('SHOW/HIDE: Couldn\'t find target selector to hide or show elements. ' +
          'Check `data-showhide-target` attribute');
      return;
    }

    let $target;

    // Check for multifield.
    // If main element was placed into multifield, all actions should take place only for the
    // current multifield section
    const $mf = $element.closest(SELECTOR_MULTIFIELD_ITEM);
    if ($mf.length) {
      $target = $mf.find(targetSelector);
    } else {
      $target = $(targetSelector);
    }

    // Make sure all unselected target elements are hidden.
    $target.not(SELECTOR_HIDDEN).each(function () {
      showHideElement($(this), true);
    });

    // Show only the element which is corresponding to the selected value
    if (targetValue !== undefined) {
      // Un-hide the target element that contains the selected value as data-showhide-target-value
      // attribute
      $target.filter(
          // Value equals (exact comparison)
          '[data-' + DATA_KEY_SHOWHIDE_TARGET_VALUE + '="' + targetValue + '"],' +
          // Or value contains (checking in a space delimited list)
          '[data-' + DATA_KEY_SHOWHIDE_TARGET_VALUE + '~="' + targetValue + '"]'
      ).each(
          function () {
            showHideElement($(this), false);
          });
    }
  }

})(document, Granite.$);