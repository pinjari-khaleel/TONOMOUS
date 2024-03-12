package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for form messages - c48 forms.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class FormMessages {

  /**
   * Error Message.
   */
  @ChildResource
  private FormMessage error;

  /**
   * Success Message.
   */
  @ChildResource
  private FormMessage success;

  /**
   * Sling Model for form message - c48 forms.
   */
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  @Getter
  public static class FormMessage {
    /**
     * Message Icon.
     */
    @ValueMapValue
    private String icon;
    /**
     * Message Heading.
     */
    @ChildResource
    private TextModel heading;
    /**
     * Message Icon.
     */
    @ValueMapValue
    private String description;
  }
}
