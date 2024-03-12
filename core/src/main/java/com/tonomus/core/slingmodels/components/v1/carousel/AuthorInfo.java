package com.tonomus.core.slingmodels.components.v1.carousel;

import lombok.Getter;

import java.util.Date;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c16 carousel.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AuthorInfo {

  /**
   * Written By Label.
   */
  @ValueMapValue
  private String writtenByLabel;

  /**
   * Date.
   */
  @ValueMapValue
  private Date date;
}
