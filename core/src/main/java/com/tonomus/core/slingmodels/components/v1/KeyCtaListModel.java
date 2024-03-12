package com.tonomus.core.slingmodels.components.v1;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for C88 Key CTA List.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class KeyCtaListModel {
  /**
   * Heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Text.
   */
  @ValueMapValue
  private String text;

  /**
   * List of CTA items.
   */
  @ChildResource
  private List<Item> list;


  /**
   * Class for c88 Key CTA List Item.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class Item {
    /**
     * Item text.
     */
    @ValueMapValue
    private String text;

    /**
     * Item value.
     */
    @ValueMapValue
    private String icon;

    /**
     * Item description.
     */
    @ValueMapValue
    private String description;

    /**
     * Item link reference.
     */
    @ValueMapValue
    private String href;

    /**
     * Item link target.
     */
    @ValueMapValue
    private String target;

  }

}
