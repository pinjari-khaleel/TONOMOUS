package com.tonomus.core.services.v2;

public interface TonomusRecaptchaValidationService {

  /**
   * Main validation method exposed for 3rd party service invocations.
   *
   * @param reCaptcha         g-recaptcha-response property
   * @return validation result
   */
  boolean validate(String reCaptcha);
}
