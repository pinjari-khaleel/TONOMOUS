package com.tonomus.core.config.caconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

/**
 * Form Subscription Context Aware Configurations.
 */
@Configuration(label = "Form Subscription Options configuration [Tonomus]",
        collection = true)
public @interface AudienceSubscriptionCaConfigurations {

  /**
   * Key.
   * @return key.
   */
  @Property(label = "Key")
  String key();

  /**
   * Value.
   * @return value.
   */
  @Property(label = "Value")
  String value();
}
