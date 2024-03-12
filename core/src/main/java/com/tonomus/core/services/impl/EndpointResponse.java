package com.tonomus.core.services.impl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Wrapper for responses with generic data model inside.
 *
 * The idea behind this wrapper is to provide additional metadata
 * (responseCode, responseMessage) to the service that initiates request,
 * because there could be more than 2 outcomes (success/failure)
 * in some types of requests (f.e., users/register),
 * and further decision should be made based on these metadata.
 *
 * @param <T> generic class for data model
 */
@Getter
@Setter
@NoArgsConstructor
public class EndpointResponse<T> {

  /**
   * Generic data model.
   */
  private T data;

  /**
   * Response code.
   */
  private int responseCode;

  /**
   * Response message.
   */
  private String responseMessage;

  /**
   * Constructor instantiates new response with response code.
   *
   * @param responseCode the status
   */
  public EndpointResponse(final int responseCode) {
    this.responseCode = responseCode;
  }

  /**
   * Constructor instantiates new response with response code and message.
   *
   * @param responseCode the status
   * @param responseMessage the message
   */
  public EndpointResponse(final int responseCode, String responseMessage) {
    this.responseCode = responseCode;
    this.responseMessage = responseMessage;
  }
}
