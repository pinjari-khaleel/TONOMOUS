package com.tonomus.core.servlets.forms;

import lombok.Getter;

import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.tonomus.core.constants.Constants;

import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestParameterMap;

import static com.tonomus.core.constants.Constants.PARAM_G_RECAPTCHA_RESPONSE;

/**
 * Form request parameters map.
 */
public class FormRequestParameterMap {

  /**
   * Param 'form_id'.
   * Used in request as field to identify a form
   */
  public static final String PARAM_FORM_ID = "form_id";

  /**
   * Predicate to get relative parameters only.
   */
  private static final Predicate<Map.Entry<String, RequestParameter[]>> PARAMETER_NAME_FILTER =
      entry -> !(entry.getKey().equals(PARAM_FORM_ID)
          || entry.getKey().equals(PARAM_G_RECAPTCHA_RESPONSE)
          || entry.getKey().startsWith(String.valueOf(Constants.COLON)));

  /**
   * Raw request parameters map.
   */
  private final RequestParameterMap requestParameterMap;

  /**
   * Form identifier.
   */
  @Getter
  private final String formId;

  /**
   * Constructor.
   * @param requestParameterMap raw request parameters map
   */
  public FormRequestParameterMap(RequestParameterMap requestParameterMap) {
    RequestParameter formIdParam =
        Optional.ofNullable(requestParameterMap.getValue(PARAM_FORM_ID))
            .orElseThrow(() -> new IllegalArgumentException("Request parameters 'form_id' is null!"));

    if (requestParameterMap.size() <= 1) {
      throw new IllegalArgumentException("Form parameters is empty!");
    }

    this.requestParameterMap = requestParameterMap;
    this.formId = formIdParam.toString();
  }

  /**
   * Get the map of form parameters.
   * @return map of form parameters
   */
  public Map<String, FormRequestParameterValue> getParameters() {
    return requestParameterMap.entrySet().stream()
        .filter(PARAMETER_NAME_FILTER)
        .collect(Collectors.toMap(Map.Entry::getKey,
            e -> new FormRequestParameterValue(e.getValue())))
        .entrySet().stream()
        .filter(e -> !e.getValue().isEmpty())
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }

}
