package com.tonomus.core.slingmodels.components.v1.accordion;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c07 accordion.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AccordionItem {

  /**
   * Label.
   */
  @ValueMapValue
  private String label;

  /**
   * Rich text content.
   */
  @ValueMapValue
  private String content;

}
