package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for all components with common properties.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CommonComponentModel {

  /**
   * Anchor Link id.
   */
  @ValueMapValue
  private String anchorId;

    /**
   * Anchor Link label.
   */
  @ValueMapValue
  private String anchorLabel;

  /**
   * Scroll component.
   */
  @ValueMapValue
  private boolean scrollComponent;

  /**
   * Style values for padding.
   */
  @ChildResource
  private PaddingModel padding;
}
