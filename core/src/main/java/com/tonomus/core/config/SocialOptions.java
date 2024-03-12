package com.tonomus.core.config;

import java.util.List;
import java.util.ResourceBundle;

import com.tonomus.core.slingmodels.components.v1.shareoptions.ShareOptionsItem;

/**
 * Social Options configuration interface.
 */
public interface SocialOptions {

  /**
   * Twitter URL.
   *
   * @return Twitter URL.
   */
  String getTwitterUrl();

  /**
   * Linkedin URL.
   *
   * @return Linkedin URL.
   */
  String getLinkedinUrl();

  /**
   * Whatsapp URL.
   *
   * @return Whatsapp URL.
   */
  String getWhatsappUrl();

  /**
   * Facebook URL.
   *
   * @return Facebook URL.
   */
  String getFacebookUrl();

  /**
   * Email URL.
   *
   * @return Email URL.
   */
  String getEmailUrl();

  /**
   * Introduction copy.
   *
   * @return Introduction copy.
   */
  String getIntroductionCopy();

  /**
   * Get list of share options based on CA configuration.
   * @param pagePath current page path.
   * @param i18nBundleObject i18nBundleObject.
   * @return List of Share Options.
   */
  List<ShareOptionsItem> getShareOptions(String pagePath, ResourceBundle i18nBundleObject);
}
