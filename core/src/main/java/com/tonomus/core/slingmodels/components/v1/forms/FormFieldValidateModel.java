package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.ObjectUtils.allNull;
import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * Form Field Validation Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FormFieldValidateModel {

  /**
   * Variable storing presence.
   */
  @ChildResource
  private ValidateMessageModel presence;

  /**
   * Variable storing validate format.
   */
  @ChildResource
  private ValidateFormat format;

  /**
   * Variable storing number validation.
   */
  @ChildResource
  private NumberValidation numericality;

  /**
   * Variable storing email.
   */
  @ChildResource
  private ValidateMessageModel email;

  /**
   * Variable storing length.
   */
  @ChildResource
  private LengthCheckModel length;

  /**
   * getJson method for serialize this object.
   *
   * @return json representation.
   */
  @JsonIgnore
  public String getJson() {
    if (allNull(presence, email, length, format, numericality)) {
      return null;
    }
    return JsonUtils.serialize(this);
  }

  /**
   * PostConstruct.
   */
  @PostConstruct private void init() {
    if (nonNull(presence) && isBlank(presence.getMessage())) {
      presence = null;
    }
    if (nonNull(email) && isBlank(email.getMessage())) {
      email = null;
    }
    if (nonNull(length) && isBlank(length.getTooLong())) {
      length = null;
    }
    if (nonNull(format) && (isBlank(format.getMessage()) || isBlank(format.getPattern()))) {
      format = null;
    }
    if (nonNull(numericality) && (isBlank(numericality.getMessage()) || !numericality.isNumericality())) {
      numericality = null;
    }
  }

  /**
   * Validate message model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ValidateMessageModel {
    /**
     * Variable storing message.
     */
    @ValueMapValue
    private String message;

    /**
     * Variable storing allowEmpty.
     */
    private boolean allowEmpty;

    /**
     * Init method to get the details of resource.
     */
    @PostConstruct protected void init() {
      allowEmpty = isBlank(message);
    }
  }

  /**
   * Length check Model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class LengthCheckModel {

    /**
     * Variable storing maximum.
     */
    @Setter
    private int maximum;

    /**
     * Variable storing message.
     */
    @ValueMapValue
    private String tooLong;
  }


  /**
   * Form Field Format Validation Model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ValidateFormat {
    /**
     * Pattern.
     */
    @ValueMapValue
    private String pattern;

    /**
     * Message.
     */
    @ValueMapValue
    private String message;

    /**
     * flag.
     */
    private String flags;

    /**
     * Model constructor.
     * @param flagList list of selected flags
     */
    @Inject
    public ValidateFormat(@ChildResource(name = "flags") List<RegExFlagModel> flagList) {
      if (Objects.nonNull(flagList)) {
        this.flags = flagList.stream().map(n -> n.regExFlags).collect(Collectors.joining());
      }
    }

    /**
     * RegEx flag model.
     */
    @Getter
    @Model(adaptables = Resource.class,
           defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
    public static class RegExFlagModel {
      /**
       * regExFlags.
       */
      @ValueMapValue
      private String regExFlags;
    }
  }

  /**
   * Form Field numericality Validation Model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class NumberValidation {
    /**
     * Is numericality.
     */
    @ValueMapValue
    private boolean numericality;

    /**
     * Message.
     */
    @ValueMapValue
    private String message;
  }
}
