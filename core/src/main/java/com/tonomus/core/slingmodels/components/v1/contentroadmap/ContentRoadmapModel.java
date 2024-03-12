package com.tonomus.core.slingmodels.components.v1.contentroadmap;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for C81 Content Roadmap.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentRoadmapModel {
  /**
   * Heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Step 1.
   */
  @ChildResource
  private ContentRoadmapStepModel step1;

  /**
   * Step 2.
   */
  @ChildResource
  private ContentRoadmapStepModel step2;

  /**
   * Step 3.
   */
  @ChildResource
  private ContentRoadmapStepModel step3;

  /**
   * Button.
   */
  @ChildResource
  private ButtonModel button;
}
