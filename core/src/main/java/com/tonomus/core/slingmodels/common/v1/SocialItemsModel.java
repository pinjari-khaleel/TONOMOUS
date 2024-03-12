package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import java.io.Serializable;
import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * A class holder for social items.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SocialItemsModel implements Serializable {
  /**
   * List of social items.
   */
  @ChildResource
  private List<SocialModel> items;
}
