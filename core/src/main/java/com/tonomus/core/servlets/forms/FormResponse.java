package com.tonomus.core.servlets.forms;

import lombok.AllArgsConstructor;

/**
 * Form response that is being sent to FE.
 */
@AllArgsConstructor
public class FormResponse {

  /**
   * Status.
   */
  private int status;

  /**
   * Message.
   */
  private String message;
}
