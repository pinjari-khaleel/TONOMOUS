package com.tonomus.core.slingmodels.common.v1;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling model for m12-social molecule.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Model(adaptables = {Resource.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SocialModel implements Serializable {

  /**
   * Variable for label.
   */
  @ValueMapValue
  private String label;

  /**
   * Variable for target.
   */
  @ValueMapValue
  private String target;

  /**
   * Variable for href.
   */
  @ValueMapValue
  private String href;

  /**
   * Variable for icon.
   */
  @ValueMapValue
  private String icon;
}
