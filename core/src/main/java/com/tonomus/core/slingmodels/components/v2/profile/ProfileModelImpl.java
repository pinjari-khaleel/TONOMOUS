package com.tonomus.core.slingmodels.components.v2.profile;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.annotation.PostConstruct;

import com.adobe.cq.wcm.core.components.models.Teaser;
import com.tonomus.core.constants.Constants;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Slf4j
@Getter
@Model(adaptables = SlingHttpServletRequest.class, 
  adapters = ProfileModel.class, 
  resourceType = ProfileModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ProfileModelImpl implements ProfileModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/profile/v2/profile";

  @Self
  @Via(type = ResourceSuperType.class)
  private Teaser teaser;

  @Getter(AccessLevel.NONE)
  @SlingObject
  private SlingHttpServletRequest request;
  
  private List<String> icons = new ArrayList<>();

  @PostConstruct
  public void init(){
    Resource actionsResource = request.getResource().getChild(Constants.ACTIONS);

    if (Objects.nonNull(actionsResource)) {
      Iterable<Resource> resources = actionsResource.getChildren();
      resources.forEach(e -> {
        String src = e.getValueMap().get(Constants.SOURCE, String.class);
        if (src != null) icons.add(src);
      });
    }
  }
}
