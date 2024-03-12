package com.tonomus.core.slingmodels.components.v1.contentslider;

import lombok.Getter;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.components.v1.contentgrid.ContentGridModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static java.util.Objects.nonNull;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;

/**
 * Class for c77 Content Slider item.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentSliderItemModel {

  /**
   * Is cream.
   */
  @ValueMapValue
  private boolean cream;

  /**
   * Is uppercaseCopy.
   */
  @ValueMapValue
  private boolean uppercaseCopy;

  /**
   * Image Desktop.
   */
  @ChildResource
  private ImageModel imageDesktop;

  /**
   * Image Mobile.
   */
  @ChildResource
  private ImageModel imageMobile;

  /**
   * Multiple Copy.
   */
  @ChildResource
  private MultipleCopyModel multipleCopy;

  /**
   * Enable Grid Content.
   */
  @ValueMapValue
  private boolean enableGridContent;

  /**
   * Grid content.
   */
  @ChildResource
  private ContentGridModel gridContent;

  /**
   * init.
   */
  @PostConstruct protected void init() {
    if (nonNull(multipleCopy) && isEmpty(multipleCopy.getCopy())) {
      multipleCopy = null;
    }
  }
}
