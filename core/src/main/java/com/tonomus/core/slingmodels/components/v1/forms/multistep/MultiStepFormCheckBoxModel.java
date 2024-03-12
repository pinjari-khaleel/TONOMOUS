package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import lombok.Getter;

import javax.inject.Inject;

import com.tonomus.core.slingmodels.components.v1.forms.FormCheckBoxModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model to be used with m28-radio-option in context of MultiStep Form.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultiStepFormCheckBoxModel extends FormCheckBoxModel {

  /**
   * Variable storing title.
   */
  @ValueMapValue
  private String title;

  /**
   * Constructor.
   * @param currentResource current resource
   */
  @Inject
  public MultiStepFormCheckBoxModel(
      @SlingObject Resource currentResource
  ) {
    super(currentResource);
  }
}
