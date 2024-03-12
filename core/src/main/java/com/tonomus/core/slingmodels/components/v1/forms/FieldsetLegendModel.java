package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Fieldset legend model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FieldsetLegendModel {

  /**
   * Legend.
   */
  @ValueMapValue
  private String text;

  /**
   * Is fieldset required.
   */
  @ValueMapValue
  private String required;

  /**
   * Legend variant.
   */
  @ValueMapValue
  private String variant;

}
