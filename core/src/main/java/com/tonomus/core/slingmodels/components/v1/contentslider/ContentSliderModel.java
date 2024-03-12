package com.tonomus.core.slingmodels.components.v1.contentslider;

import lombok.Getter;

import java.util.stream.IntStream;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.ChildResourceCounterModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import static com.tonomus.core.constants.NumberConstants.ONE;
import static com.tonomus.core.constants.NumberConstants.ZERO;

/**
 * Class for c77 Content Slider.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentSliderModel extends ChildResourceCounterModel {

  /**
   * Specific array for slider pagination.
   */
  private int[] itemsCountArray;

  /**
   * init.
   */
  @PostConstruct
  protected void initContentSliderModel() {
    if (getColumnCount() > ZERO) {
      itemsCountArray = IntStream.rangeClosed(ONE, getColumnCount()).toArray();
    }
  }
}
