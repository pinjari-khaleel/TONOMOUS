package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for AlignmentModel Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AlignmentModel {
  /**
   * Horizontal.
   */
  @ValueMapValue
  private String horizontal;

  /**
   * Vertical.
   */
  @ValueMapValue
  private String vertical;
}
