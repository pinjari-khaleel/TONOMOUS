package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

import javax.annotation.PostConstruct;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.models.newsroom.lightbox.Data;
import com.tonomus.core.slingmodels.analytics.ButtonEventTracking;
import com.tonomus.core.utils.JsonUtils;
import com.tonomus.core.utils.MediaUtils;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for m02-button molecule.
 */
@Getter
@Setter
@NoArgsConstructor
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Slf4j
public class ButtonModel extends LinkModel {

  /**
   * Variable for title.
   */
  @ValueMapValue
  private String title;

  /**
   * Variable for id.
   */
  @ValueMapValue
  private String id;

  /**
   * Variable for type.
   */
  @ValueMapValue
  private String type;

  /**
   * Variable for prefix.
   */
  @ValueMapValue
  private String prefix;

  /**
   * Variable for suffix.
   */
  @ValueMapValue
  private String suffix;

  /**
   * Variable for theme.
   */
  @ValueMapValue
  private String theme;

  /**
   * Variable for level.
   */
  @ValueMapValue
  private String level;

  /**
   * Variable for variant.
   */
  @ValueMapValue
  private String variant;

  /**
   * Variable for second icon.
   */
  @ValueMapValue
  private String secondIcon;

  /**
   * Icon Alignment.
   */
  @ValueMapValue
  private String iconAlignment;

  /**
   * Variable for size.
   */
  @ValueMapValue
  private String size;

  /**
   * Variable for attrs.
   */
  @Setter
  @ValueMapValue
  private String attrs;

  /**
   * Video.
   */
  @Setter
  @ChildResource
  private VideoModel video;

  /**
   * Video type.
   */
  @ValueMapValue
  private String videoType;

  /**
   * Modal block.
   */
  @ChildResource
  private ModalModel modal;

  /**
   * Data.
   */
  private Data data;

  /**
   * Boolean flag indicating the call to global (Oxagon) form.
   */
  @ValueMapValue
  private boolean form;

  /**
   * Disabled button.
   */
  @ValueMapValue
  private boolean disabled;

  /**
   * Analytics data.
   */
  @Self
  private ButtonEventTracking eventTracking;

  /**
   * Background image.
   */
  @ChildResource
  private ImageModel backgroundImage;

  /**
   * getJson method for serialize this object.
   *
   * @return json representation.
   */
  @JsonIgnore public String getModalJson() {
    if (modal != null && modal.getHeading() != null && modal.getHeading().getText() != null) {
      return JsonUtils.serialize(modal);
    } else {
      return null;
    }
  }

  /**
   * initialize.
   */
  @PostConstruct
  void initialize() {
    if (MediaUtils.isVideoNotPresent(video)) {
      video = null;
    } else {
      if (isBothVideoTypeExists()) {
        // if both types were provided, only one should be visible to the user
        MediaUtils.youtubeOrDam(videoType, video);
      }
    }
  }

  /**
   * Check if both video types (DAM and Youtube id) references were added to the component.
   * @return true if both fields are not empty
   */
  private boolean isBothVideoTypeExists() {
    return Optional.ofNullable(video.getProps())
        .map(props -> StringUtils.isNotBlank(props.getYoutube())
            && CollectionUtils.isNotEmpty(props.getSources()))
        .orElse(false);
  }

}
