package com.tonomus.core.slingmodels.components.v1.video_modal;

import java.util.Objects;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

import com.tonomus.core.slingmodels.common.v1.HeaderModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.VideoModel;
import com.tonomus.core.utils.MediaUtils;

import lombok.Getter;

/**
 * Class for C96 Video Modal
 */
@Getter
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class VideoModalModel {

  @ChildResource
  private HeaderModel header;

  @ChildResource
  private ImageModel image;

  @ChildResource
  private VideoModel video;

  /**
   * initialize.
   */
  @PostConstruct
  void initialize() {
    if (MediaUtils.isVideoNotPresent(video)) {
      video = null;
    } else {
      video.getProps().setAutoplay(true);
    }
  }
}