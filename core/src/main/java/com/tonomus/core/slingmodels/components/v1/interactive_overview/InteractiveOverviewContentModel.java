package com.tonomus.core.slingmodels.components.v1.interactive_overview;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c83 Interactive Overview Card content.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class InteractiveOverviewContentModel {

  /**
   * Item heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Rich text Copy.
   */
  @ValueMapValue
  private String copy;

  /**
   * Image model.
   */
  @ChildResource
  private ImageModel image;

}
