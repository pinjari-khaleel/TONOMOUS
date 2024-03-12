package com.tonomus.core.slingmodels.components.v1.interactive_overview;

import lombok.Getter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.slingmodels.common.v1.HeaderModel;
import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c83 Interactive Overview Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class InteractiveOverviewModel {

  /**
   * Header.
   */
  @ChildResource
  private HeaderModel header;

  /**
   * Items.
   */
  @ChildResource
  private List<InteractiveOverviewItemModel> items;

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
