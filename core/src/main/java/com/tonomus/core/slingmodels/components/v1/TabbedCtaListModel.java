package com.tonomus.core.slingmodels.components.v1;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c84 tabbed cta list.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TabbedCtaListModel {

  /**
   * Items.
   */
  @ChildResource
  private List<Item> items;

  /**
   * Class for c84 Tab Items.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class Item {
    /**
     * Item title.
     */
    @ValueMapValue
    private String labelVal;

    /**
     * Item title size.
     */
    @ValueMapValue
    private String sizeVal;

    /**
     * Rich text Description.
     */
    @ValueMapValue
    private String description;

    /**
     * Image model.
     */
    @ChildResource
    private ImageModel image;

    /**
     * Button.
     */
    @ChildResource
    private ButtonModel button;
  }
}
