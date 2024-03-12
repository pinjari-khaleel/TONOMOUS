package com.tonomus.core.config.impl;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import com.tonomus.core.config.SocialOptions;
import com.tonomus.core.config.caconfig.SocialOptionsCaConfiguration;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.components.v1.shareoptions.ShareOptionsItem;
import com.tonomus.core.utils.LangUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;

import static java.util.Objects.nonNull;

/**
 * Social Options configuration model implementation.
 */
public class SocialOptionsImpl implements SocialOptions {

  /**
   * Twitter URL.
   */
  @Getter
  private String twitterUrl;

  /**
   * Linkedin URL.
   */
  @Getter
  private String linkedinUrl;

  /**
   * Whatsapp URL.
   */
  @Getter
  private String whatsappUrl;

  /**
   * Facebook URL.
   */
  @Getter
  private String facebookUrl;

  /**
   * Email URL.
   */
  @Getter
  private String emailUrl;

  /**
   * Introduction Copy.
   */
  @Getter
  private String introductionCopy;

  /**
   * Constructor.
   * @param resource resource
   */
  public SocialOptionsImpl(Resource resource) {
    setConfiguration(resource);
  }

  /**
   * Set config values.
   * @param resource resource
   */
  private void setConfiguration(Resource resource) {
    ConfigurationBuilder builder = resource.adaptTo(ConfigurationBuilder.class);
    if (nonNull(builder)) {
      SocialOptionsCaConfiguration caConfig = builder.as(SocialOptionsCaConfiguration.class);
      twitterUrl = caConfig.twitterUrl();
      linkedinUrl = caConfig.linkedinUrl();
      whatsappUrl = caConfig.whatsappUrl();
      facebookUrl = caConfig.facebookUrl();
      emailUrl = caConfig.emailUrl();
      introductionCopy = caConfig.introductionCopy();
    }
  }

  /**
   * Method to handle and pull Share Options.
   * @param pagePath current page path.
   * @param i18nBundleObject i18nBundleObject.
   * @return List of Share Options.
   */
  public List<ShareOptionsItem> getShareOptions(String pagePath, ResourceBundle i18nBundleObject) {
    List<ShareOptionsItem> shareOptions = new ArrayList<>();
    if (StringUtils.isNotBlank(twitterUrl)) {
      shareOptions.add(new ShareOptionsItem(formatterValue(twitterUrl, pagePath), "twitter",
          LangUtils.getI18nStringOrKey(i18nBundleObject, Constants.TWITTER_LABEL),
          Constants.TWITTER_ICON));
    }
    if (StringUtils.isNotBlank(linkedinUrl)) {
      shareOptions.add(new ShareOptionsItem(formatterValue(linkedinUrl, pagePath), "linkedin",
          LangUtils.getI18nStringOrKey(i18nBundleObject, Constants.LINKEDIN_LABEL),
          Constants.LINKEDIN_ICON));
    }
    if (StringUtils.isNotBlank(facebookUrl)) {
      shareOptions.add(new ShareOptionsItem(formatterValue(facebookUrl, pagePath), "facebook",
          LangUtils.getI18nStringOrKey(i18nBundleObject, Constants.FACEBOOK_LABEL),
          Constants.FACEBOOK_ICON));
    }
    if (StringUtils.isNotBlank(whatsappUrl)) {
      shareOptions.add(new ShareOptionsItem(formatterValue(whatsappUrl, pagePath), "whatsapp",
          LangUtils.getI18nStringOrKey(i18nBundleObject, Constants.WHATSAPP_LABEL),
          Constants.WHATSAPP_ICON));
    }
    if (StringUtils.isNotBlank(emailUrl)) {
      shareOptions.add(new ShareOptionsItem(formatterValue(emailUrl, pagePath), "email",
          LangUtils.getI18nStringOrKey(i18nBundleObject, Constants.EMAIL_LABEL),
          "email-gold"));
    }
    shareOptions.add(new ShareOptionsItem(pagePath, "clipboard",
        LangUtils.getI18nStringOrKey(i18nBundleObject, Constants.COPY_LINK), "link-gold"));

    return shareOptions;
  }

  /**
   * Method to format value from configuration with variables.
   * @param configurationValue value from configuration.
   * @param pagePath page path.
   * @return formatted value.
   */
  private String formatterValue(String configurationValue, String pagePath) {
    return configurationValue.replace("{$URL}", pagePath).
          replace("{$TEXT}", introductionCopy).
          replace("{$VIA}", "NEOM");
  }
}
