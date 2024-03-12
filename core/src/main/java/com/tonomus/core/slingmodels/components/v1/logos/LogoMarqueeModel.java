package com.tonomus.core.slingmodels.components.v1.logos;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c85 Logo Marquee.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LogoMarqueeModel {

  /**
   * Logo Items.
   */
  @ChildResource
  private List<LogosItemModel> items;

  /**
   * Heading.
   */
  @ChildResource
  private TextModel heading;
}
