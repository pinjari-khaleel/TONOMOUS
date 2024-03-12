package com.tonomus.core.legacy.cloud;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Google recaptcha cloud services configuration sling model.
 */
@Model(adaptables = Resource.class)
@Getter
public class GoogleRecaptchaConfiguration {

  /**
   * reCaptchaSiteKey.
   */
  @ValueMapValue
  private String reCaptchaSiteKey;

  /**
   * reCaptchaSecreteKey.
   */
  @ValueMapValue
  private String reCaptchaSecretKey;
}
