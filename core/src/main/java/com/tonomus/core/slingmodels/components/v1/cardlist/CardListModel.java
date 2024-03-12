package com.tonomus.core.slingmodels.components.v1.cardlist;

import lombok.Getter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c82 card list.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CardListModel {

  /**
   * Items.
   */
  @ChildResource
  private List<CardItemModel> items;

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
