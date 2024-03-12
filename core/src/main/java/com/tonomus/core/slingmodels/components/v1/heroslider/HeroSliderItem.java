package com.tonomus.core.slingmodels.components.v1.heroslider;

import lombok.Getter;

import java.util.Objects;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.BackButtonLinkModel;
import com.tonomus.core.slingmodels.common.v1.ComponentBackgroundModel;
import com.tonomus.core.utils.MediaUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class c12 Hero Slider items.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HeroSliderItem {

  /**
   * Topic.
   */
  @ValueMapValue
  private String topic;

  /**
   * Horizontal alignment.
   */
  @ValueMapValue
  private String alignHorizontal;

  /**
   * Vertical alignment.
   */
  @ValueMapValue
  private String alignVertical;

  /**
   * Scroll Button option.
   */
  @ValueMapValue
  private boolean scrollButton;

  /**
   * Background.
   */
  @ChildResource
  private ComponentBackgroundModel background;

  /**
   * Hero Slider Content block.
   */
  @ChildResource
  private HeroSliderContent content;

  /**
   * Go Back Redirect Link.
   */
  @ChildResource
  private BackButtonLinkModel link;

  /**
   * Show Go Back Link.
   */
  @ValueMapValue
  private boolean showGoBackLink;

  /**
   * Current resource.
   */
  @SlingObject
  private Resource currentResource;

  /**
   * Post construction.
   */
  @PostConstruct
  private void init() {
    if (Objects.nonNull(background) && !MediaUtils.isVideoNotPresent(background.getVideo())) {
      background.getVideo().getProps().setAutoplay(true);
    }
    if (!Objects.nonNull(link)) {
      link = new BackButtonLinkModel(null, null, currentResource);
    }
  }
}
