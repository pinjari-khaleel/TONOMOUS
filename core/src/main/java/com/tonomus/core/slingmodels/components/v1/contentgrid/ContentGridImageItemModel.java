package com.tonomus.core.slingmodels.components.v1.contentgrid;

import lombok.Getter;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.ImageModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static com.tonomus.core.constants.Constants.IMAGE;

/**
 * Class for c24/m16 image item model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentGridImageItemModel extends ContentGridBaseItemModel {

  /**
   * Image content.
   */
  @ChildResource
  private ContentGridImageItemContent content;

  /**
   * init.
   */
  @PostConstruct
  protected void init() {
    // For backward compatibility
    if (IMAGE.equals(getType())) {
      setType("asset");
    }
  }

  /**
   * Class for c24/m16 image item content model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ContentGridImageItemContent {
    /**
     * Variant.
     */
    @ValueMapValue
    private String variant;

    /**
     * Variant.
     */
    @ValueMapValue
    private String assetPropsVariant;

    /**
     * Image.
     */
    @ChildResource
    private ImageModel image;

    /**
     * Mobile Image.
     */
    @ChildResource
    private ImageModel mobileImage;
  }
}
