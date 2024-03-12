package com.tonomus.core.slingmodels.components.v1.contentgrid;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c24/m17 list item model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentGridListItemModel extends ContentGridBaseItemModel {

  /**
   * Image content.
   */
  @ChildResource
  private ContentGridListItemContent content;

  /**
   * Class for c24/m17 list item content model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ContentGridListItemContent {
    /**
     * Variant.
     */
    @ValueMapValue
    private String variant;

    /**
     * Header.
     */
    @ChildResource
    private ListHeaderModel header;

    /**
     * Image.
     */
    @ChildResource
    private List<ListItemModel> items;

    /**
     * Size.
     */
    @ValueMapValue
    private String size;

    /**
     * Ordered.
     */
    @ValueMapValue
    private boolean ordered;

    /**
     * Buttons list.
     */
    @ChildResource
    private List<ButtonModel> buttons;
  }

  /**
   * Class for c24/m17 list item model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ListItemModel {
    /**
     * Title.
     */
    @ValueMapValue
    private String title;

    /**
     * Copy.
     */
    @ValueMapValue
    private String copy;
  }

  /**
   * Header Class for m17 list item model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ListHeaderModel {
    /**
     * Header's heading.
     */
    @ChildResource
    private TextModel heading;
    /**
     * Copy.
     */
    @ChildResource
    private ListCopyModel copy;
  }

  /**
   * Copy Class for m17 list item model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ListCopyModel {
    /**
     * Variable for size.
     */
    @ValueMapValue
    private String size;

    /**
     * Variable for content.
     */
    @ValueMapValue
    private String content;
  }
}
