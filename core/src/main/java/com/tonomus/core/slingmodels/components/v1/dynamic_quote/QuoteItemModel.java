package com.tonomus.core.slingmodels.components.v1.dynamic_quote;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c80 Quote Item.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class QuoteItemModel {

  /**
   * Quote Model.
   */
  @ChildResource
  private QuoteModel quote;
}
