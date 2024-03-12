package com.tonomus.core.legacy.cloud;

import lombok.Getter;

/**
 * List of cloud services configurations available within the system.
 */
@Getter
public enum CloudServiceConfiguration {

  /**
   * Google recaptcha configuration.
   */
  GOOGLE_RECAPTCHA("google-recaptcha", GoogleRecaptchaConfiguration.class),
  /**
   * Forms collector configuration.
   */
  FORM_COLLECTOR("form-collector", FormCollectorConfiguration.class);

  /**
   * Configuration identifier (service name).
   */
  private String code;

  /**
   * Model that the resource should be adapted to.
   */
  private Class<?> modelClass;

  /**
   * Constructor.
   * @param code code
   * @param modelClass model class
   */
  CloudServiceConfiguration(String code, Class<?> modelClass) {
    this.code = code;
    this.modelClass = modelClass;
  }

}
