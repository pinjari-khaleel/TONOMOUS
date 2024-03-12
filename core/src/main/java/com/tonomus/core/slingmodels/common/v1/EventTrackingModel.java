package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model to be used for tracking events.
 */
@Getter
@Setter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class EventTrackingModel {

  /**
   * Variable storing event name.
   */
  @ValueMapValue
  private String event;

  /**
   * Variable storing event category.
   */
  @ValueMapValue
  private String eventCategory;

  /**
   * Variable storing event action.
   */
  @ValueMapValue
  private String eventAction;

  /**
   * Variable storing event label.
   */
  @ValueMapValue
  private String eventLabel;

  /**
   * getJson method for serialize this object.
   *
   * @return json representation.
   */
  @JsonIgnore
  public String getJson() {
    return JsonUtils.serialize(this);
  }
}
