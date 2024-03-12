package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for form model - o45.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class FormGroupModel extends FormFieldBase {

  /**
   * Name.
   */
  @ValueMapValue
  private String name;

  /**
   * Variable storing type.
   */
  @ValueMapValue
  private String type;

  /**
   * Variable storing legend.
   */
  @ValueMapValue
  private String legend;

  /**
   * Variable storing legend.
   */
  @ValueMapValue
  private String copy;

  /**
   * Inject self Resource.
   */
  @Self
  private transient Resource currentResource;

  /**
   * The component is empty.
   */
  private boolean empty;

  /**
   * Required.
   */
  @ValueMapValue
  private boolean required;

  /**
   * Validate.
   */
  @ChildResource
  private FormFieldValidateModel validate;

  /**
   * Post construct.
   */
  @PostConstruct
  private void init() {
    empty = !currentResource.hasChildren();
  }
}
