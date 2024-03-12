package com.tonomus.core.slingmodels.components.v1.dynamic_quote;

import lombok.Getter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.slingmodels.components.v1.BaseShareModel;
import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c80 Dynamic Quote.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class DynamicQuoteModel extends BaseShareModel {

  /**
   * Items.
   */
  @ChildResource
  private List<QuoteItemModel> items;

  /**
   * Next Quote CTA Label.
   */
  @ValueMapValue
  private String nextQuoteCTALabel;

  /**
   * ItemsJson method for serialize items list.
   *
   * @return json representation.
   */
  @JsonIgnore
  public String getItemsJson() {
    return JsonUtils.serialize(items);
  }
}
