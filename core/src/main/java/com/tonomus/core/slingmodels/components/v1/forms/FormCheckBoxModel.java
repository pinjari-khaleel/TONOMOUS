package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import javax.inject.Inject;

import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.ImageModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Form checkbox model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FormCheckBoxModel extends FormFieldBase {

  /**
   * Variable storing label.
   */
  @ValueMapValue
  private String label;

  /**
   * Variable storing titleInEnglish.
   */
  @ValueMapValue
  private String titleInEnglish;

  /**
   * Disabled.
   */
  @ValueMapValue
  private boolean disabled;

  /**
   * Checked.
   */
  @ValueMapValue
  private boolean checked;

  /**
   * Name.
   */
  @ValueMapValue
  private String name;

  /**
   * Copy.
   */
  @ValueMapValue
  private String copy;

  /**
   * Required.
   */
  @ValueMapValue
  private boolean required;

  /**
   * Value.
   */
  @ValueMapValue
  private String value;

  /**
   * Image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Checkbox type.
   */
  @Getter
  private String type;

  /**
   * Constructor.
   * @param currentResource current resource
   */
  @Inject
  public FormCheckBoxModel(
      @SlingObject Resource currentResource
  ) {
    if (currentResource.isResourceType(Constants.M28_RADIO_OPTION_RESOURCE)) {
      type = Constants.RADIO;
    } else {
      type = Constants.CHECKBOX;
    }
  }

}
