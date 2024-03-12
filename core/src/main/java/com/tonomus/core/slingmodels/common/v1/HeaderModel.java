package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.NoArgsConstructor;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for m04-component-header molecule.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@NoArgsConstructor
public class HeaderModel {

  /**
   * Header's eyebrow.
   */
  @ChildResource
  private TextModel eyebrow;

  /**
   * Header's flipHeading.
   */
  @ChildResource
  private FlipHeadingModel flipHeading;

  /**
   * Header's heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Header's moustache.
   */
  @ChildResource
  private TextModel moustache;

  /**
   * Header's alignment (left, center).
   */
  @ValueMapValue
  private String alignment;

  /**
   * Header Copy.
   */
  @ValueMapValue
  private String copy;

  /**
   * Disable transition.
   */
  @ValueMapValue
  private boolean disableTransition;

  /**
   * Constructor.
   * @param heading heading model
   * @param moustache moustache text model
   */
  public HeaderModel(final TextModel heading, final TextModel moustache) {
    this.heading = heading;
    this.moustache = moustache;
  }
}
