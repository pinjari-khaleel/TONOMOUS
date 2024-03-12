package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * Class for Padding.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PaddingModel {
  /**
   * Style values for padding.
   */
  private String styleInline;

  /**
   * Constructor.
   *
   * @param start start
   * @param end   end
   */
  @Inject public PaddingModel(@ValueMapValue(name = "start") final String start,
      @ValueMapValue(name = "end") final String end) {
    if (isNotBlank(start) || isNotBlank(end)) {
      StringBuilder builder = new StringBuilder("--component-block-padding: var(--");
      builder.append(getPaddingCssClassName(start)).append(")");
      if ((isNotBlank(end) && !end.equals(start)) || (isNotBlank(start) && !start.equals(end))) {
        builder.append(" var(--").append(getPaddingCssClassName(end)).append(")");
      }
      builder.append(";");
      this.styleInline = builder.toString();
    }
  }

  /**
   * Calculate padding css class name by padding value.
   *
   * @param paddingValue padding value
   * @return padding css class name
   */
  private String getPaddingCssClassName(String paddingValue) {
    if (isBlank(paddingValue)) {
      return "container-margin";
    }
    return "block-padding-" + paddingValue;
  }
}
