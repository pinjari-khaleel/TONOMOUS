package com.tonomus.core.config.impl;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.tonomus.core.config.FormSubscriptionOptions;
import com.tonomus.core.config.caconfig.AudienceSubscriptionCaConfigurations;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;

/**
 * The class is used to map subscription response in the form to the value
 * that is used in BigQuery. E.g. "yes" - "subscribed", "no" - "unsubscribed".
 */
@Slf4j
public class FormSubscriptionOptionsImpl implements FormSubscriptionOptions {

  /**
   * Statuses map.
   */
  private final Map<String, String> statuses;

  /**
   * Public constructor.
   *
   * @param resource form resource
   */
  public FormSubscriptionOptionsImpl(@NonNull Resource resource) {
    statuses = Optional.ofNullable(resource.adaptTo(ConfigurationBuilder.class))
        .map(builder -> builder.asCollection(AudienceSubscriptionCaConfigurations.class))
        .orElse(Collections.emptyList()).stream().filter(config -> config.key() != null).collect(
            Collectors.toMap(AudienceSubscriptionCaConfigurations::key, AudienceSubscriptionCaConfigurations::value));
  }

  @Override public String getStatus(String key) {
    String result = statuses.get(key);
    if (result == null) {
      log.error("Unknown contactPermissions value [{}]", key);
    }
    return result;
  }
}
