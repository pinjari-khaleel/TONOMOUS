package com.tonomus.core.slingmodels.components.v1.peoplecarousel;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling model for job description to use in {@link BusinessCardModel}.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class JobDescription {

  /**
   * Job title.
   */
  @ValueMapValue
  private String title;

  /**
   * Department.
   */
  @ValueMapValue
  private String department;

}
