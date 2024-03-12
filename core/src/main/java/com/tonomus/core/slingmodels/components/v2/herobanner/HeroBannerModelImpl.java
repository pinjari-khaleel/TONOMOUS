package com.tonomus.core.slingmodels.components.v2.herobanner;

import lombok.Getter;

import java.util.List;

import com.adobe.cq.wcm.core.components.models.Teaser;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;

/**
 * Class for Hero Banner component.
 */
@Getter
@Model(adaptables = SlingHttpServletRequest.class, 
  adapters = HeroBannerModel.class, 
  resourceType = HeroBannerModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HeroBannerModelImpl implements HeroBannerModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/herobanner/v2/herobanner";

  @Self
  @Via(type = ResourceSuperType.class)
  private Teaser teaser;

  @ChildResource
  private List<DescriptionModel> descriptions;

}
