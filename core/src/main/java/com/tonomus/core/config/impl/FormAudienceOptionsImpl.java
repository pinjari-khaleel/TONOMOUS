package com.tonomus.core.config.impl;

import lombok.NonNull;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.tonomus.core.config.FormAudienceOptions;
import com.tonomus.core.config.caconfig.AudienceOptionsCaConfigurations;
import com.tonomus.core.utils.AudienceOptionsUtils;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;

/**
 * The class is used to get correct form audience configurations for resource.
 * Looks up for Context Aware Configurations.
 */
public class FormAudienceOptionsImpl implements FormAudienceOptions {

  /**
   * Map that contains form identifier as a key.
   * Values are organized as a MultiMap with language + interest is a key.
   */
  private final Map<String, MultiKeyMap<String, String>> configurations;

  /**
   * Public constructor.
   * @param resource requested resource
   */
  public FormAudienceOptionsImpl(@NonNull Resource resource) {

    configurations = Optional.ofNullable(resource.adaptTo(ConfigurationBuilder.class))
            .map(builder -> builder.asCollection(AudienceOptionsCaConfigurations.class))
            .orElse(Collections.emptyList()).stream()
            .collect(Collectors.toMap(AudienceOptionsCaConfigurations::formId,
                config -> AudienceOptionsUtils.getAudienceOptionsMap(config.configRows())));
  }

  /**
   * Get audience options by form id.
   * @param formId  form id
   * @return audience options
   */
  @Override public MultiKeyMap<String, String> getAudienceOptions(final String formId) {
    return configurations.get(formId);
  }
}
