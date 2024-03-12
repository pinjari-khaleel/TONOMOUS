package com.tonomus.core.services;

/**
 * Interface for AEM Environment Info Service to expose instance info.
 * The first method is definition instance as author ot publish.
 */
public interface AemEnvService {

  /**
   * This method return 'true' if the current instance is author.
   *
   * @return boolean is author instance
   */
  boolean isAuthor();
}
