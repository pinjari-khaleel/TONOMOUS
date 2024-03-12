package com.tonomus.core.slingmodels.components.v2.marquee;

import com.tonomus.core.slingmodels.common.v1.ImageModel;

import lombok.Getter;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Getter
@Model(adaptables = Resource.class, 
  adapters = MarqueeModel.class, 
  resourceType = MarqueeModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MarqueeModelImpl implements MarqueeModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/marquee/v2/marquee";

  @ChildResource
  private List<ImageModel> images;

  @ValueMapValue
  private String id;

  @ValueMapValue
  private String accessibilityLabel;
}
