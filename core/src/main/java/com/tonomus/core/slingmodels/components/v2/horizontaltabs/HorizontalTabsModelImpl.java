package com.tonomus.core.slingmodels.components.v2.horizontaltabs;

import lombok.Getter;

import com.adobe.cq.wcm.core.components.models.Tabs;
import com.tonomus.core.slingmodels.common.v1.LinkModel;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Getter
@Model(adaptables = SlingHttpServletRequest.class, 
  adapters = HorizontalTabsModel.class, 
  resourceType = HorizontalTabsModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HorizontalTabsModelImpl implements HorizontalTabsModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/horizontaltabs/v2/horizontaltabs";

  @Self
  @Via(type = ResourceSuperType.class)
  private Tabs tabs;

  @ValueMapValue
  private String title;

  @ValueMapValue
  private String description;

  @ChildResource
  private LinkModel action;
}
