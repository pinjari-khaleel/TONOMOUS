package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for Logo.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LogoModel {

  /**
   * Logo URL.
   */
  @ValueMapValue
  private String href;

  /**
   * Label field.
   */
  @ValueMapValue
  private String label;

  /**
   * Image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * SVG content.
   */
  @ValueMapValue
  private String svgContent;
}
