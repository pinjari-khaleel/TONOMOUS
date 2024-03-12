package com.tonomus.core.services;

import lombok.NonNull;

import java.util.Map;

import com.tonomus.core.services.impl.EndpointResponse;

/**
 * Interface for NeomFormsCollectorService to send forms data.
 */
public interface NeomFormsCollectorService {

  /**
   * Send form data to the Neom Forms Collector.
   * @param uri uri
   * @param data data
   * @return response
   */
  EndpointResponse<String> sendFormData(@NonNull String uri,
      @NonNull Map<String, Object> data);
}
