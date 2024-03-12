package com.tonomus.core.config;

import org.apache.commons.collections4.map.MultiKeyMap;

/**
 * Forms Audience Options interface.
 */
public interface FormAudienceOptions {

  /**
   * Audience Options.
   *
   * @param formId  form id
   * @return Audience Options.
   */
  MultiKeyMap<String, String> getAudienceOptions(String formId);
}
