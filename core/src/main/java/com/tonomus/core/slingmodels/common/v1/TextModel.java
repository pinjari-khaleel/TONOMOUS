package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.Setter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for: a03-heading, a04-eyebrow, a05-moustache, a07-label atoms.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TextModel {

  /**
   * Variable storing size.
   */
  @Setter
  @ValueMapValue
  private String size;

  /**
   * Variable storing text.
   */
  @Setter
  @ValueMapValue
  private String text;

  /**
   * Variable storing element size.
   */
  @Setter
  @ValueMapValue
  private String element;

  /**
   * Variable storing copy.
   */
  @Setter
  @ValueMapValue
  private String copy;
}
