package com.tonomus.core.slingmodels.components.v2.card;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import com.adobe.cq.wcm.core.components.models.Teaser;
import com.tonomus.core.slingmodels.components.v2.video.VideoModel;

import java.util.Optional;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Slf4j
@Getter
@Model(adaptables = SlingHttpServletRequest.class, 
  adapters = CardModel.class, 
  resourceType = CardModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CardModelImpl implements CardModel{

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/card/v2/card";

  @Self
  @Via(type = ResourceSuperType.class)
  private Teaser teaser;

  @ChildResource
  private VideoModel video;

  @ValueMapValue
  private String html;

  public String getImageFileReference(){
    return Optional.ofNullable(teaser.getImageResource()).map(Resource::getValueMap).map(vm -> vm.get("fileReference", String.class)).orElse(null);
  }
}
