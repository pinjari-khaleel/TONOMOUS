package com.tonomus.core.slingmodels.components.v1.cardslider;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c90 card slider component.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CardSliderModel {
  /**
   * Slider's heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * List of cards.
   */
  @ChildResource
  private List<CardSliderBaseCardModel> items;
}
