package com.tonomus.core.config.impl;

import lombok.Getter;

import com.tonomus.core.config.GenericSiteConfig;
import com.tonomus.core.config.caconfig.GenericSiteCaConfiguration;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;

import static java.util.Objects.nonNull;

/**
 * Implementation for generic site-specific configurations.
 */
public class GenericSiteConfigImpl implements GenericSiteConfig {

  /**
   * Facebook domain verification code.
   */
  @Getter
  private String facebookDomainVerification;

  /**
   * Adobe Launch configuration.
   */
  @Getter
  private String adobeLaunchConfiguration;

  /**
   * Adobe Launch configuration.
   */
  @Getter
  private boolean adobeLaunchAsyncScriptEnable;

  /**
   * Delay in milliseconds for Adobe Launch JS code (the default value is 3000 ms).
   */
  @Getter
  private String delay;

  /**
   * GTM Id.
   */
  @Getter
  private String gtmId;

  /**
   * Lightweight Google tag id.
   */
  @Getter
  private String lightGtmId;

  /**
   * Constructor.
   *
   * @param resource resource
   */
  public GenericSiteConfigImpl(Resource resource) {
    setConfiguration(resource);
  }

  /**
   * Set config values.
   *
   * @param resource resource
   */
  private void setConfiguration(Resource resource) {
    ConfigurationBuilder builder = resource.adaptTo(ConfigurationBuilder.class);
    if (nonNull(builder)) {
      GenericSiteCaConfiguration caConfig = builder.as(GenericSiteCaConfiguration.class);
      facebookDomainVerification = caConfig.facebookDomainVerification();
      adobeLaunchConfiguration = caConfig.adobeLaunchConfigurationScript();
      adobeLaunchAsyncScriptEnable = caConfig.adobeLaunchAsyncScriptEnable();
      delay = caConfig.delay();
      gtmId = caConfig.gtmId();
      lightGtmId = caConfig.lightGtmId();
    }
  }
}
