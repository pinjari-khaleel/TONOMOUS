package com.tonomus.core.slingmodels.components.v1.logos;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c51 and c85 LogosItemModel.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LogosItemModel {

  /**
   * Image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Link.
   */
  @ChildResource
  private LinkModel link;
}
