package com.tonomus.core.slingmodels.components.v1.carousel;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import javax.annotation.PostConstruct;

import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.ButtonModel;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c16 carousel.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CarouselModel {
  /**
   * Variant.
   */
  @ValueMapValue
  private String variant;
  /**
   * Inject self Resource.
   */
  @Self
  private Resource currentResource;

  /**
   * list of CarouselItem.
   */
  @Getter
  private List<CarouselItem> items;

  /**
   * CTA button.
   */
  @ChildResource
  private ButtonModel ctaButton;

  /**
   * init method for slingModel.
   */
  @PostConstruct private void init() {
    items = new ArrayList<>();
    Iterator<Resource> resourceIterator = currentResource.listChildren();
    while (resourceIterator.hasNext()) {
      Resource resItem = resourceIterator.next();
      String resourceType = resItem.getResourceType();
      if (StringUtils.equals(resourceType, Constants.CAROUSEL_ITEM_RES_TYPE)) {
        CarouselItem carouselItem = resItem.adaptTo(CarouselItem.class);
        if (Objects.nonNull(carouselItem)) {
          items.add(carouselItem);
        }
      }
    }
  }
}
