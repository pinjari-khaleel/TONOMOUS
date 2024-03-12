package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import java.util.concurrent.atomic.AtomicLong;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static com.tonomus.core.constants.NumberConstants.ZERO;

/**
 * Sling Model for a form field model with attribute 'id'.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class FormFieldBase {

  /**
   * English language.
   */
  public static final AtomicLong SEQUENCE = new AtomicLong(ZERO);

  /**
   * Variable storing id.
   */
  @ValueMapValue
  private String id;

  /**
   * initialize.
   */
  @PostConstruct
  void initialize() {
    if (StringUtils.isBlank(id)) {
      id = getNextFormId();
    }
  }

  /**
   * Generate ID for form field.
   * @return form foeld id
   */
  public static String getNextFormId() {
    return "id" + SEQUENCE.incrementAndGet();
  }
}
