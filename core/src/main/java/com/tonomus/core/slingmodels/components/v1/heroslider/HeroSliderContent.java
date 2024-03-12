package com.tonomus.core.slingmodels.components.v1.heroslider;

import lombok.Getter;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.HeaderModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;
import com.tonomus.core.slingmodels.common.v1.VideoModel;
import com.tonomus.core.utils.MediaUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class c12 Hero Slider.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HeroSliderContent {

  /**
   * Button type.
   */
  @ValueMapValue
  @Default(values = "regular")
  private String buttonType;

  /**
   * Header Model.
   */
  @ChildResource
  private HeaderModel header;

  /**
   * List of buttons.
   */
  @ChildResource
  private List<ButtonModel> buttons;

  /**
   * Video type.
   */
  @ValueMapValue
  private String videoType;

  /**
   * Main Video.
   */
  @ChildResource
  private VideoModel video;

  /**
   * Button eyebrow.
   */
  @ChildResource
  private TextModel buttonEyebrow;

  /**
   * init.
   */
  @PostConstruct
  void init() {
    processButtons();

    if (MediaUtils.isVideoNotPresent(video)) {
      video = null;
    } else {
      video.getProps().setAutoplay(true);
    }
  }

  /**
   * Processing individual buttons in context of DAM/YouTube video support.
   *
   */
  public void processButtons() {
    if ("regular".equals(buttonType)) {
      Optional.ofNullable(buttons).ifPresent(bl -> bl.stream()
          .filter(Objects::nonNull)
          .filter(b -> !MediaUtils.isVideoNotPresent(b.getVideo()))
          .forEach(buttonModel -> buttonModel.setAttrs("data-video-button")));
    }
  }
}
