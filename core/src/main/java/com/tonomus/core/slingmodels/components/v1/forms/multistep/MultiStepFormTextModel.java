package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import lombok.Getter;

import com.tonomus.core.slingmodels.components.v1.forms.FormTextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model to be used with m30-text-field in context of Oxagon Form.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultiStepFormTextModel extends FormTextModel {

  /**
   * Wide.
   */
  @ValueMapValue
  private boolean wide;
}
