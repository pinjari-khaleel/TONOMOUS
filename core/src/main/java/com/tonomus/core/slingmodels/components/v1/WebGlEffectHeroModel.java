package com.tonomus.core.slingmodels.components.v1;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.VideoModel;
import com.tonomus.core.slingmodels.components.v1.heroslider.HeroSliderItem;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c79 WebGL Effect Hero.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class WebGlEffectHeroModel {

  /**
   *Looping video.
   */
  @ChildResource
  private VideoModel loopingVideo;

  /**
   * Hero Slider Item.
   */
  @ChildResource
  private HeroSliderItem heroSliderItem;

  /**
   * Open video button.
   */
  @ChildResource
  private ButtonModel openVideoButton;

  /**
   * Play button.
   */
  @ChildResource
  private ButtonModel playButton;

  /**
   * Play button.
   */
  @ChildResource
  private ButtonModel muteButton;

  /**
   * Get in touch button.
   */
  @ChildResource
  private ButtonModel getInTouch;

}
