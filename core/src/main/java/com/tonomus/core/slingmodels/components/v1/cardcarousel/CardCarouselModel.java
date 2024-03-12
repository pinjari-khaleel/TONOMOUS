package com.tonomus.core.slingmodels.components.v1.cardcarousel;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.HeaderModel;
import com.tonomus.core.slingmodels.components.v1.carousel.CarouselItem;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Sling model for C87 Card Carousel.
 */
@Getter
@Model(adaptables = Resource.class,
       cache = true,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CardCarouselModel {

  /**
   * Carousel heading.
   */
  @ChildResource
  private HeaderModel header;

  /**
   * list of CarouselItem.
   */
  @Getter
  @ChildResource
  private List<CarouselItem> items;

}
