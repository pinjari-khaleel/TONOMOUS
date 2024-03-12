package com.tonomus.core.services;

/**
 * Interface for Neom Configurations Service to expose only required methods.
 */
public interface NeomConfigurations {

  /**
   * this method should return the environment.
   *
   * @return String Environment.
   */
  String getEnvironment();
}
