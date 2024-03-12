package com.tonomus.core.config.caconfig;

import com.tonomus.core.constants.NumberConstants;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

/**
 * Sling Context-Aware interface for generic site-specific configurations.
 */
@Configuration(label = "Generic site-specific context configurations [Tonomus]",
               description = "Generic site-specific context configurations")
public @interface GenericSiteCaConfiguration {

  /**
   * Facebook domain verification code.
   *
   * @return Facebook domain verification code
   */
  @Property(label = "Facebook domain verification code",
            description = "Set Facebook domain verification code",
            order = NumberConstants.FOUR)
  String facebookDomainVerification();

  /**
   * Adobe Launch configuration.
   *
   * @return Adobe Launch configuration script.
   */
  @Property(label = "Adobe Launch configuration",
            description = "Set Adobe Launch script",
            order = NumberConstants.THREE)
  String adobeLaunchConfigurationScript();

  /**
   * Adobe Launch JS script in order to manage flicker is enabled.
   *
   * @return Adobe Launch is enabled.
   */
  @Property(label = "Adobe Launch JS script in order to manage flicker",
            description = "Adobe recommends to enable this script",
            order = NumberConstants.ONE)
  boolean adobeLaunchAsyncScriptEnable();

  /**
   * Delay in milliseconds for Adobe Launch JS code (the default value is 3000 ms).
   *
   * @return delay in milliseconds for Adobe Launch JS code.
   */
  @Property(label = "Delay in milliseconds for Adobe Launch JS code (the default value is 3000 ms)",
            description = "Set delay in milliseconds for Adobe Launch JS code",
            order = NumberConstants.TWO)
  String delay();

  /**
   * GTM Id.
   *
   * @return GTM Id.
   */
  @Property(label = "GTM Id",
            description = "Set GTM Id",
            order = NumberConstants.FIVE)
  String gtmId();

  /**
   * Lightweight Google tag id.
   *
   * @return lightweight Google tag id.
   */
  @Property(label = "Lightweight GTM Id",
            description = "Set lightweight GTM Id",
            order = NumberConstants.SIX)
  String lightGtmId();
}
