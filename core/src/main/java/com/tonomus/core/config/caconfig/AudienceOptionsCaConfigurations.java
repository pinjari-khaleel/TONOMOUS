package com.tonomus.core.config.caconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

/**
 * Audience Ids Options configuration.
 */
@Configuration(label = "Audience Ids Options configuration [Tonomus]",
               description = "Audience Ids Options configuration",
               collection = true)
public @interface AudienceOptionsCaConfigurations {

  /**
   * Form Id.
   * @return form id.
   */
  @Property(label = "Form id",
            description = "Form id")
  String formId();

  /**
   * Audience Options.
   * @return Audience Options.
   */
  @Property(label = "Config Rows. Sample: language,custType,audience_id",
            description = "Config Rows. Sample: language,custType,audience_id")
  String[] configRows();
}
