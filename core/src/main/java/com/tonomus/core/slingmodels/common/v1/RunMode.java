package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.tonomus.core.services.NeomConfigurations;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;


/**
 * Get AEM run modes.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class RunMode {

  /**
   * Neom Configurations.
   */
  @Inject
  private NeomConfigurations neomConfig;

  /**
   * AEM environment.
   */
  private String environment;

  /**
   * Init the sling model.
   */
  @PostConstruct protected void init() {
    environment = Optional.ofNullable(neomConfig)
        .map(NeomConfigurations::getEnvironment).orElse(null);
  }
}
