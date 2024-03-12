package com.tonomus.core.legacy.cloud;

import lombok.Getter;

import java.util.Optional;

import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.webservicesupport.Configuration;
import com.day.cq.wcm.webservicesupport.ConfigurationConstants;
import com.day.cq.wcm.webservicesupport.ConfigurationManager;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

/**
 * Cloud services configurations available for the resource.
 */
public class ResourceCloudServices {

  /**
   * Cloud services paths available for the resource.
   */
  @Getter
  private final String[] allServices;

  /**
   * Configuration manager.
   */
  private final ConfigurationManager configurationManager;

  /**
   * Constructor.
   * @param resource resource to get cloud services configurations for
   */
  public ResourceCloudServices(Resource resource) {
    ResourceResolver resolver = resource.getResourceResolver();
    Page page = Optional.ofNullable(resolver.adaptTo(PageManager.class))
        .map((PageManager pageManager) -> pageManager.getContainingPage(resource))
        .orElseThrow(() ->
            new IllegalArgumentException("Provided resource is not sub-node of a page"));

    HierarchyNodeInheritanceValueMap pageProperties =
        new HierarchyNodeInheritanceValueMap(page.getContentResource());
    allServices =
        pageProperties.getInherited(ConfigurationConstants.PN_CONFIGURATIONS, new String[0]);

    configurationManager =
        Optional.ofNullable(resolver.adaptTo(ConfigurationManager.class))
            .orElseThrow(() -> new IllegalStateException("Unable to initialize Configuration "
                + "Manager"));
  }

  /**
   * Get required cloud services configuration.
   *
   * @param config cloud services configuration
   * @return configuration
   * @param <T> configuration model class
   */
  public <T> T getConfiguration(CloudServiceConfiguration config) {
    Configuration configuration =
        configurationManager.getConfiguration(config.getCode(), allServices);
    if (configuration == null) {
      throw new IllegalArgumentException("Please configure cloud service: " + config.getCode());
    }
    return (T) configuration.getContentResource().adaptTo(config.getModelClass());
  }

}
