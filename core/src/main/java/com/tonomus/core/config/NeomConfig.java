package com.tonomus.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/**
 * This interface contains the all configuration properties for the Tonomus Site.
 */
@ObjectClassDefinition(name = "Tonomus Configuration",
                       description = "Tonomus Configuration Details")
public @interface NeomConfig {

  /**
   * AEM Environment.
   *
   * @return String Environment
   */
  @AttributeDefinition(name = "AEM Environment",
                       description = "AEM Environment") String environment() default "dev";
}

