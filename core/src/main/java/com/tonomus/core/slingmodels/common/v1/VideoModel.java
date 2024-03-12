package com.tonomus.core.slingmodels.common.v1;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling model for video atom.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Model(adaptables = {Resource.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class VideoModel {

  /**
   * Video caption that is displayed during playing.
   */
  @ValueMapValue
  private String label;

  /**
   * Data-attribute.
   */
  @Setter
  private String data;

  /**
   * Config.
   */
  @ChildResource
  private VideoPropsModel props;

  /**
   * Play button.
   */
  @ChildResource
  @JsonIgnore
  private ButtonModel playButton;

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
