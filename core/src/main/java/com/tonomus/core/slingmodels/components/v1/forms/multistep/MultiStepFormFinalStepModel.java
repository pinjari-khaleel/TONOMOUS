package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ComponentBackgroundModel;
import com.tonomus.core.slingmodels.common.v1.SocialItemsModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for Multi-step Form Final Step.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultiStepFormFinalStepModel {

  /**
   * Background.
   */
  @ChildResource
  private ComponentBackgroundModel background;

  /**
   * Socials items holder.
   */
  @ChildResource
  private SocialItemsModel social;

  /**
   * Success submission properties.
   */
  @ChildResource
  private FormSubmissionResultModel success;

  /**
   * Success submission properties.
   */
  @ChildResource
  private FormSubmissionResultModel error;

  /**
   * Follow Us Label.
   */
  @ValueMapValue
  private String followUsLabel;

  /**
   * Done Button Label.
   */
  @ValueMapValue
  private String doneButtonLabel;

  /**
   * Try Again Button Label.
   */
  @ValueMapValue
  private String tryAgainButtonLabel;

  /**
   * Copy Class for FormSubmitionResult Model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class FormSubmissionResultModel {

    /**
     * Header's eyebrow.
     */
    @ChildResource
    private TextModel eyebrow;

    /**
     * Header's heading.
     */
    @ChildResource
    private TextModel heading;

    /**
     * Header's copy.
     */
    @ChildResource
    private CopyModel copy;

  }

  /**
   * Copy Class for copy model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class CopyModel {
    /**
     * Variable for size.
     */
    @ValueMapValue
    private String size;

    /**
     * Variable for content.
     */
    @ValueMapValue(injectionStrategy = InjectionStrategy.REQUIRED)
    private String content;
  }

}
