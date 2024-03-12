package com.tonomus.core.models;

import lombok.AllArgsConstructor;

/**
 * Form response that is being sent to FE.
 */
@AllArgsConstructor
public class GenericPayloadResponse {

  public static final String MESSAGE_500 = "Something went wrong. Please try it later.";

  /**
   * Status.
   */
  private int status;

  /**
   * Message.
   */
  private String message;
}
