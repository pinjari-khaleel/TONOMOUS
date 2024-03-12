package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Builder;
import lombok.Getter;

import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for Mailchimp Audience ID.
 */
@Getter
@Builder
public class MailchimpAudienceID {

  /**
   * Language.
   */
  @ValueMapValue
  private String language;

  /**
   * Customer Type.
   */
  @ValueMapValue
  private String custType;

  /**
   * Audience ID.
   */
  @ValueMapValue
  private String id;
}


