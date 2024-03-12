package com.tonomus.core.slingmodels.components.v2.container;

import lombok.Getter;

import com.adobe.cq.wcm.core.components.models.LayoutContainer;
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
  adapters = ContainerModel.class, 
  resourceType = ContainerModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContainerModelImpl implements ContainerModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/container/v2/container";

  @Self
  @Via(type = ResourceSuperType.class)
  private LayoutContainer layoutContainer;

  @ChildResource
  private LinkModel action;

  @ValueMapValue
  private String title;

}
