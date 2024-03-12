package com.tonomus.core.legacy.cloud;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Forms collector cloud services configuration sling model.
 */
@Model(adaptables = Resource.class)
@Getter
public class FormCollectorConfiguration {

  /**
   * Tonomus Forms Collector url.
   */
  @ValueMapValue
  private String url;
  /**
   * Tonomus Forms Collector apiKey.
   */
  @ValueMapValue
  private String apiKey;

}
