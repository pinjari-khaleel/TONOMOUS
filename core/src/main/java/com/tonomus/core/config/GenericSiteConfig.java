package com.tonomus.core.config;

/**
 * Interface for generic site-specific configurations.
 */
public interface GenericSiteConfig {

  /**
   * Facebook domain verification code.
   *
   * @return Facebook domain verification code
   */
  String getFacebookDomainVerification();

  /**
   * Adobe Launch configuration.
   *
   * @return Adobe Launch script.
   */
  String getAdobeLaunchConfiguration();

  /**
   * Adobe Launch JS script in order to manage flicker is enabled.
   *
   * @return Adobe Launch is enabled.
   */
  boolean isAdobeLaunchAsyncScriptEnable();

  /**
   * Delay in milliseconds for Adobe Launch JS code (the default value is 3000 ms).
   *
   * @return delay in milliseconds for Adobe Launch JS code.
   */
  String getDelay();

  /**
   * GTM Id.
   *
   * @return GTM Id.
   */
  String getGtmId();

  /**
   * Lightweight Google tag id.
   *
   * @return lightweight Google tag id
   */
  String getLightGtmId();
}
