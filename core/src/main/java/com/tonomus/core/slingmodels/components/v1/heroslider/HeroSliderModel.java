package com.tonomus.core.slingmodels.components.v1.heroslider;

import lombok.Getter;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class c12 Hero Slider.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HeroSliderModel {

  /**
   * Hero Slider Items.
   */
  @ChildResource
  private List<HeroSliderItem> items;
}
