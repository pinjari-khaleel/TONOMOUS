package com.tonomus.core.slingmodels.components.v1.contentroadmap;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for C81 Content Roadmap Step.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentRoadmapStepModel {

  /**
   * Step heading.
   */
  @ChildResource
  private TextModel heading;
  /**
   * Step image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Step copy.
   */
  @ValueMapValue
  private String text;
}
