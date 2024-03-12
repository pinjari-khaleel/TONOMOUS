package com.tonomus.core.slingmodels.components.v2.video;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import com.adobe.cq.wcm.core.components.models.Embed;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.utils.MediaUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Slf4j
@Getter
@Model(adaptables = {SlingHttpServletRequest.class, Resource.class}, adapters = VideoModel.class, resourceType = VideoModelImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class VideoModelImpl implements VideoModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/video/v2/video";

  @Self
  @Via(type = ResourceSuperType.class)
  private Embed embed;

  @ValueMapValue
  private String src;

  @ValueMapValue
  private boolean autoplay;

  @ValueMapValue
  private boolean muted;

  @ValueMapValue
  private boolean loop;

  @Default(values = StringUtils.EMPTY)
  @ValueMapValue(name = "type")
  private String videoType;

  @ValueMapValue
  private String poster;

  @Getter(AccessLevel.NONE)
  @SlingObject
  private Resource resource;

  public String getMediaType() {
    return videoType.equals(Constants.INTERNAL) ? MediaUtils.getMediaType(resource, src) : null;
  }

}
