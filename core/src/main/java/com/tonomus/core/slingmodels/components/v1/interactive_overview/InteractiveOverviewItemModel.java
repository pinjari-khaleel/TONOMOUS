package com.tonomus.core.slingmodels.components.v1.interactive_overview;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c83 Interactive Overview Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class InteractiveOverviewItemModel {

  /**
   * Content.
   */
  @ChildResource
  private InteractiveOverviewContentModel content;
}
