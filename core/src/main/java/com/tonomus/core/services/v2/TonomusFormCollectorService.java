package com.tonomus.core.services.v2;

import lombok.NonNull;

import java.util.Map;

import com.tonomus.core.services.impl.v2.EndpointResponse;

/**
 * Interface for NeomFormsCollectorService to send forms data.
 */
public interface TonomusFormCollectorService {

  /**
   * Send form data to the Neom Forms Collector.
   * @param data data
   * @return response
   */
  EndpointResponse<String> sendFormData(@NonNull Map<String, Object> data);
}
