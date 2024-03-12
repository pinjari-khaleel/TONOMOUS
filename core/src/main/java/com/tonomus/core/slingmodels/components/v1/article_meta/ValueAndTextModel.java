package com.tonomus.core.slingmodels.components.v1.article_meta;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for Text and Value.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ValueAndTextModel {
  /**
   * Value.
   */
  @ValueMapValue
  private String value;

  /**
   * Text.
   */
  @ValueMapValue
  private String text;
}
