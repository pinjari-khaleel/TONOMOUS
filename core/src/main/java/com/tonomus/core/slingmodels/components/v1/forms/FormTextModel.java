package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

import javax.annotation.PostConstruct;

import com.tonomus.core.constants.Constants;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * Sling Model for input model.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class FormTextModel extends FormFieldBase {

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
   * Variable storing type.
   */
  @Setter
  @ValueMapValue
  private String type;

  /**
   * Disabled.
   */
  @ValueMapValue
  private boolean disabled;

  /**
   * Variable storing maxlength.
   */
  @ValueMapValue
  private Integer maxlength;

  /**
   * Name.
   */
  @ValueMapValue
  @Setter
  private String name;

  /**
   * Placeholder.
   */
  @ValueMapValue
  private String placeholder;

  /**
   * Value.
   */
  @ValueMapValue
  @Setter
  private String value;

  /**
   * Readonly.
   */
  @ValueMapValue
  private boolean readonly;

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
   * characters.
   */
  @ValueMapValue
  @Default(values = "characters")
  private String charactersLabel;

  /**
   * PostConstruct.
   */
  @PostConstruct protected void init() {
    if (Objects.isNull(maxlength)) {
      maxlength = Constants.THOUSAND;
    }
    if (nonNull(validate) && nonNull(validate.getLength())
        && isNotBlank(validate.getLength().getTooLong())) {
      validate.getLength().setMaximum(maxlength);
    }
  }
}
