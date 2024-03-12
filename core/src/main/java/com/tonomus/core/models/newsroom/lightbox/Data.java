package com.tonomus.core.models.newsroom.lightbox;

import lombok.Getter;
import lombok.Setter;

import com.google.gson.annotations.SerializedName;

/**
 * POJO is used to store Newsroom Gallery Lightbox information.
 */
@Getter
@Setter
public class Data {

  /**
   * Agree Terms.
   */
  @SerializedName(value = "agree-terms")
  private String agreeTerms;

  /**
   * Close Terms.
   */
  @SerializedName(value = "close-terms")
  private String closeTerms;
}
