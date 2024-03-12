package com.tonomus.core.servlets.forms.v2.helper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.xss.XSSAPI;

/**
 * Form request parameter value.
 */
public class FormRequestParameterValue {

  /**
   * All values are internally stored as an array of strings.
   */
  private final List<String> values;

  private final XSSAPI xssapi;

  /**
   * Constructor.
   * 
   * @param values raw request values
   */
  public FormRequestParameterValue(RequestParameter[] values, XSSAPI xssapi) {
    this.xssapi = xssapi;
    this.values = Arrays.stream(Optional.ofNullable(values).orElseGet(() -> new RequestParameter[] {}))
        .map(e -> (xssapi.encodeForHTML(e.getString())))
        .filter(StringUtils::isNotBlank)
        .collect(Collectors.toUnmodifiableList());
  }

  /**
   * Get value.
   * 
   * @return if there is only 1 value in the raw array, then the simple String is
   *         returned
   */
  public Object getValue() {
    if (values.size() == 1) {
      return values.get(0);
    } else {
      return List.copyOf(values);
    }
  }

  /**
   * Check for value emptiness.
   * 
   * @return true if no value present
   */
  public boolean isEmpty() {
    return values.isEmpty();
  }

}
