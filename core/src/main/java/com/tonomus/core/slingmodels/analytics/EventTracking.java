package com.tonomus.core.slingmodels.analytics;

import lombok.Getter;

import java.util.Map;

import com.tonomus.core.constants.NumberConstants;
import com.tonomus.core.utils.AnalyticsConstants;

/**
 * Parent Event tracking class.
 */
@Getter
public abstract class EventTracking {

  /**
   * Defines if eventTracking was enabled for the instance.
   */
  private final boolean enabled;

  /**
   * Data that will be included into the markup in JSON format.
   */
  private final Map<String, String> data;

  /**
   * Constant numeric for hash length.
   */
  private static final int HASH_LENGTH = 10;

  /**
   * Custom id field name.
   * @return field name
   */
  protected abstract String getAttributeName();

  /**
   * The id attribute is generated based on the following logic:
   * + first 10 characters of the path that was encoded with the SHA-1 algorithm;
   * + human-readable id provided by a content manager.
   * The decision on shortening encoded value to first 10 numbers was made based on
   * http://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#Short-SHA-1
   * @param enableTracking is tracking enabled
   * @param hash user provided event tracking id
   * @param id hashed path
   * @param eventAction event action
   */
  protected EventTracking(final boolean enableTracking,
      final String hash,
      final String id,
      final String eventAction) {
    this.enabled = enableTracking;
    if (enabled && hash != null) {
      this.data = Map.of(getAttributeName(), hash.substring(NumberConstants.ZERO, HASH_LENGTH) + "-" + id,
                        AnalyticsConstants.PN_EVENT_ACTION, eventAction);
    } else {
      this.data = null;
    }
  }
}
