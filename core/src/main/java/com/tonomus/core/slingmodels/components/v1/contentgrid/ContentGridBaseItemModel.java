package com.tonomus.core.slingmodels.components.v1.contentgrid;

import lombok.Getter;
import lombok.Setter;

import com.tonomus.core.slingmodels.common.v1.AlignmentModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for content-grid base item model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentGridBaseItemModel {

  /**
   * Type.
   */
  @Setter
  @ValueMapValue
  private String type;

  /**
   * Alignment.
   */
  @ChildResource
  private AlignmentModel align;
}
