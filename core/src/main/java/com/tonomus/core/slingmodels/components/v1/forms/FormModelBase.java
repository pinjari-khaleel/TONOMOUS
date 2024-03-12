package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.Locale;
import java.util.Optional;

import javax.annotation.PostConstruct;

import com.google.gson.annotations.SerializedName;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.legacy.cloud.CloudServiceConfiguration;
import com.tonomus.core.legacy.cloud.GoogleRecaptchaConfiguration;
import com.tonomus.core.legacy.cloud.ResourceCloudServices;
import com.tonomus.core.utils.LangUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Generic class members for forms Sling Model.
 */
@Slf4j
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FormModelBase {

  /**
   * Variable storing action.
   */
  @Setter
  private String action;

  /**
   * Variable storing form id.
   */
  @ValueMapValue
  @SerializedName(Constants.FORM_ID_FIELD_NAME)
  private String id;

  /**
   * Variable storing titleInEnglish.
   */
  @ValueMapValue
  private String titleInEnglish;

  /**
   * Variable storing  template slug.
   */
  @ValueMapValue
  private String templateSlug;

  /**
   * reCaptchaSiteKey.
   */
  private String reCaptchaSiteKey;

  /**
   * Google reCaptcha branding text.
   */
  @ValueMapValue
  private String branding;

  /**
   * Current language code.
   */
  private String languageCode;

  /**
   * Inject self Resource.
   */
  @SlingObject
  private transient Resource currentResource;

  /**
   * Init method for class members belong to this Sling Model.
   */
  @PostConstruct
  protected void init() {
    String actionPath = currentResource.getResourceResolver().map(currentResource.getPath());
    setAction(actionPath + ".form");

    try {
      reCaptchaSiteKey = Optional.ofNullable(new ResourceCloudServices(currentResource))
          .map(services -> services.getConfiguration(CloudServiceConfiguration.GOOGLE_RECAPTCHA))
          .map(configuration -> ((GoogleRecaptchaConfiguration) configuration).getReCaptchaSiteKey())
          .orElse(null);
    } catch (IllegalArgumentException | IllegalStateException e) {
      log.error("Unable to get recaptcha site key: ", e);
    }

    Locale locale = LangUtils.getCurrentLocale(currentResource);
    languageCode = Optional.ofNullable(locale).map(Locale::getLanguage)
        .orElse(LangUtils.DEFAULT_LOCALE.getLanguage());
  }
}
