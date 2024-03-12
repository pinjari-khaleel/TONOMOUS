package com.tonomus.core.slingmodels.components.v1.contentgrid;

import lombok.Getter;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.VideoModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

import static com.tonomus.core.constants.Constants.VIDEO;

/**
 * Class for c20/a19 video item model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentGridVideoItemModel extends ContentGridBaseItemModel {

  /**
   * Image content.
   */
  @ChildResource
  private ContentGridVideoItemContent content;

  /**
   * init.
   */
  @PostConstruct
  protected void init() {
    // For backward compatibility
    if (VIDEO.equals(getType())) {
      setType("asset");
    }
  }

  /**
   * Class for c20/a19 video item content model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ContentGridVideoItemContent {

    /**
     * Video.
     */
    @ChildResource
    private VideoModel video;
  }
}
