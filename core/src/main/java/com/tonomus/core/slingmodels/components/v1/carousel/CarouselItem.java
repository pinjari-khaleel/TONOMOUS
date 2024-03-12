package com.tonomus.core.slingmodels.components.v1.carousel;

import lombok.Getter;

import java.util.Objects;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;
import com.tonomus.core.slingmodels.common.v1.VideoModel;
import com.tonomus.core.utils.MediaUtils;

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
public class CarouselItem {

  /**
   * Title = Old field kept for backward compatibility.
   */
  @ValueMapValue
  private String title;

  /**
   * Heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Type = Old field kept for backward compatibility.
   */
  @ValueMapValue
  private String type;

  /**
   * Variant.
   */
  @ValueMapValue
  private String variant;

  /**
   * Image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Video.
   */
  @ChildResource
  private VideoModel video;

  /**
   * Button.
   */
  @ChildResource
  private ButtonModel button;

  /**
   * Social Media Icon.
   */
  @ValueMapValue
  private String socialMediaIcon;

  /**
   * Author Info.
   */
  @Self
  private AuthorInfo authorInfo;

  /**
   * Link Info.
   */
  @ChildResource
  private LinkModel link;

  /**
   * initialize.
   */
  @PostConstruct void initialize() {
    if (MediaUtils.isVideoNotPresent(video)) {
      video = null;
    } else {
      video.getProps().setAutoplay(true);
    }
    if (Objects.nonNull(image) && Objects.nonNull(title)) {
      image.setAlt(title);
    }
    // Following lines are due to data structure changes and this ensures backward compatibility
    // and prevents component breaking on live pages.
    if (Objects.isNull(variant)) {
      variant = type;
    }
    if (Objects.isNull(heading)) {
      heading = new TextModel();
      heading.setText(title);
    }
  }
}
