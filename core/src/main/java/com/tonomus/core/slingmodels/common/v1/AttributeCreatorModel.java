package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Stream;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;

/**
 * Class for creation arbitrary dynamic attributes in HTL.
 */
@Slf4j
@Getter
@Model(adaptables = SlingHttpServletRequest.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AttributeCreatorModel {

  /**
   * Comma- or space-separated list of dynamic attributes following one or both patterns below.
   * Patterns:
   * 1. attribute=value pair,
   * 2. just attribute without value.
   * Delimiters:
   * 1. not a word word character (letters, digits, underscore),
   * 2. not '=',
   * 3. not '-'.
   */
  public static final String REGEX_SPLIT_ATTRS = "[^\\w\\=\\-]+";

  /**
   * Resulting Map for all attributes.
   */
  @Getter
  private final Map<String, Object> attributes = new LinkedHashMap<>();

  /**
   * Inject constructor.
   *
   * @param attrs comma- or space-separated list of attributes, for example: "data-something1 attr2 attr3=attr3value"
   */
  @Inject
  public AttributeCreatorModel(@RequestAttribute(name = "attrs") final String attrs) {
    if (StringUtils.isBlank(attrs)) {
      return;
    }
    Stream.of(attrs.split(REGEX_SPLIT_ATTRS))
        .filter(StringUtils::isNotBlank).forEach(this::processAttr);
  }

  /**
   * Populate model's Map based on given name-value pair.
   *
   * @param nameValuePair name-value pair or just attribute name
   */
  private void processAttr(final String nameValuePair) {
    final String[] split = nameValuePair.split("=");
    final String key = split[0];
    final Object value;

    if (split.length == 2) {
      value = split[1];
    } else {
      if (split.length > 2) {
        log.error("Error while parsing attribute: {}", nameValuePair);
      }
      // Case of attribute without value
      value = true;
    }
    attributes.put(key, value);
  }
}
