package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import lombok.Getter;

import java.util.Objects;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

/**
 * Sling Model for Multi-step Form Step.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultiStepFormStepModel {

  /**
   * Step ResourceType of MultiStep Form.
   */
  public static final String RT_MULTISTEPFORM_STEP =
      "tonomus/components/content/wrappers/c59-step";

  /**
   * Step number.
   */
  private int step;

  /**
   * reCaptcha Branding text.
   */
  private String recaptchaBranding;

  /**
   * Inject constructor.
   * @param currentResource currentResource.
   */
  @Inject
  public MultiStepFormStepModel(@Self @Named("currentResource") final Resource currentResource) {
    int index = 0;
    Resource parent = Objects.requireNonNull(currentResource.getParent());
    this.recaptchaBranding = parent.getValueMap().get("branding", String.class);
    for (final Resource next : parent.getChildren()) {
      if (!RT_MULTISTEPFORM_STEP.equals(next.getResourceType())) {
        continue;
      }
      if (currentResource.getName().equals(next.getName())) {
        step = index;
        break;
      }
      index++;
    }
  }
}
