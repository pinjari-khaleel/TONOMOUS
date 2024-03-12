package com.tonomus.core.slingmodels.components.v1;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for C94 Error Page Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ErrorPageModel {

  /**
   * Item heading text.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Image model.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Rich text Description.
   */
  @ValueMapValue
  private String description;

  /**
   * Button model.
   */
  @ChildResource
  private ButtonModel button;

}
