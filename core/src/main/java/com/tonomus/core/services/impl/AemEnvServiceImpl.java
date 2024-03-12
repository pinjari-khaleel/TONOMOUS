package com.tonomus.core.services.impl;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

import com.tonomus.core.services.AemEnvService;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/**
 * Class implementation for AEM Environment Info Service to expose instance info.
 * The first method is definition instance as author ot publish.
 */
@Slf4j
@Component(immediate = true, service = AemEnvService.class)
@Designate(ocd = AemEnvServiceImpl.Configuration.class)
public class AemEnvServiceImpl implements AemEnvService {

  /**
   * is Author.
   */
  @Getter
  private boolean author;

  /**
   * This method gets triggered on Activation or modification of configurations.
   *
   * @param config config
   **/
  @Activate protected void activate(Map<String, Object> config) {
    this.author = (boolean) config.getOrDefault("author", false);
  }

  /**
   * This interface contains the all configuration properties for the Neom Site.
   */
  @ObjectClassDefinition(name = "Neom AEM instance info service configuration",
                         description = "Service to define AEM instance parameters.")
  public @interface Configuration {

    /**
     * Is Author instance.
     *
     * @return boolean Is Author instance
     */
    @AttributeDefinition(name = "Is Author",
                         description = "Is the current instance is author?")
    boolean author() default false;
  }
}
