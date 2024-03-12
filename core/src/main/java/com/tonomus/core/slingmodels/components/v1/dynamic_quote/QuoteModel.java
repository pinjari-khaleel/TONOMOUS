package com.tonomus.core.slingmodels.components.v1.dynamic_quote;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c80 Quote Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class QuoteModel {

  /**
   * Item heading text.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Item active.
   */
  @ValueMapValue
  private boolean active;

  /**
   * Image model.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Rich text content.
   */
  @ValueMapValue
  private String content;

}
