package com.tonomus.core.services.impl;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import com.tonomus.core.config.NeomConfig;
import com.tonomus.core.services.NeomConfigurations;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;


/**
 * This class contains Neom project configurations.
 */
@Slf4j
@Component(immediate = true,
           service = NeomConfigurations.class)
@Designate(ocd = NeomConfig.class)
public class NeomConfigurationsImpl implements NeomConfigurations {

  /**
   * Variable holds the environment.
   */
  @Getter
  private String environment;

  /**
   * This method gets triggered on Activation or modification of configurations.
   *
   * @param neomConfig NeomConfig
   */
  @Activate
  @Modified
  protected void activate(final NeomConfig neomConfig) {
    environment = neomConfig.environment();
  }
}
