package com.tonomus.core.services.impl;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.Optional;

import com.tonomus.core.services.CaptchaValidationService;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * Google Recaptcha validation service.
 * The service is responsible for interaction with the Google API to provide validation.
 * In case of any failure during the interaction, captcha will be considered as false.
 */
@Slf4j
@Component
public class GoogleRecaptchaValidationServiceImpl extends AbstractHttpClient
    implements CaptchaValidationService {

  /**
   * Google API Path.
   */
  private static final String URI = "https://www.google.com/recaptcha/api/siteverify";

  /**
   * Secret parameter name.
   */
  private static final String SECRET_PARAMETER = "secret";

  /**
   * Response parameter name.
   */
  private static final String RESPONSE_PARAMETER = "response";

  /**
   * Inject HttpClientBuilderFactory.
   */
  @Reference
  @Getter
  private HttpClientBuilderFactory httpClientBuilderFactory;

  @Override
  public boolean validate(String reCaptchaSecret, String reCaptcha) {
    try {
      if (StringUtils.isEmpty(reCaptcha)) {
        log.error("Unable to validate: reCaptcha or currentPagePath are null");
        return false;
      }
      return validateCaptcha(reCaptchaSecret, reCaptcha);
    } catch (Exception e) {
      log.error("Error", e);
      return false;
    }
  }

  /**
   * Method responsible for sending request to Google API.
   *
   * @param secretKey       recaptcha secret key
   * @param captchaResponse recaptcha token
   * @return validation result
   */
  private boolean validateCaptcha(String secretKey, String captchaResponse) {
    HttpPost postRequest = new HttpPost(URI);
    Map<String, String> payload = Map.of(SECRET_PARAMETER, secretKey,
        RESPONSE_PARAMETER, captchaResponse);
    addPayload(postRequest, payload);
    return Optional.of(executeRequest(GoogleRecaptchaResponse.class, postRequest))
        .map(EndpointResponse::getData).map(data -> ((GoogleRecaptchaResponse) data).success)
        .orElse(false);
  }

  /**
   * Google Recaptcha validation response.
   */
  class GoogleRecaptchaResponse {
    /**
     * Validation flag.
     */
    private boolean success;
  }
}
