package com.tonomus.core.slingmodels.components.v1.contentslider;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c77 Content Slider Multiple Copy Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultipleCopyModel {

  /**
   * Heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * List of copies.
   */
  @ChildResource
  private List<CopyModel> copy;

  /**
   * Class for c77 Content Slider Copy Model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class CopyModel {
    /**
     * highlight.
     */
    @ValueMapValue
    private boolean highlight;

    /**
     * Content.
     */
    @ValueMapValue
    private String content;
  }
}
