package com.tonomus.core.config.caconfig;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

/**
 * Social Options configuration.
 */
@Configuration(label = "Social Options context configuration [Tonomus]",
               description = "Social Options context configuration")
public @interface SocialOptionsCaConfiguration {

  /**
   * Twitter URL.
   * @return Twitter URL.
   */
  @Property(label = "Twitter URL",
            description = "Set the Twitter URL.")
  String twitterUrl();

  /**
   * Linkedin URL.
   * @return Linkedin URL.
   */
  @Property(label = "Linkedin URL",
            description = "Set the Linkedin URL.")
  String linkedinUrl();

  /**
   * Whatsapp URL.
   * @return Whatsapp URL.
   */
  @Property(label = "Whatsapp URL",
          description = "Set the Whatsapp URL.")
  String whatsappUrl();

  /**
   * Facebook URL.
   * @return Facebook URL.
   */
  @Property(label = "Facebook URL",
          description = "Set the Facebook URL.")
  String facebookUrl();

  /**
   * Email URL.
   * @return Email URL.
   */
  @Property(label = "Email URL",
          description = "Set the Email URL.")
  String emailUrl();

  /**
   * Introduction Copy.
   * @return Introduction Copy.
   */
  @Property(label = "Introduction Copy",
          description = "Set the Introduction Copy.")
  String introductionCopy();
}
