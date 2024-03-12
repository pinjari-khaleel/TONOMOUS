package com.tonomus.core.utils;

import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Type;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import com.day.cq.commons.LanguageUtil;

import static com.tonomus.core.constants.Constants.DOLLAR;
import static com.tonomus.core.constants.Constants.SLASH;
import static com.tonomus.core.constants.Constants.TONOMUS_CONTENT_PATH;
import static org.apache.commons.lang3.StringUtils.EMPTY;

/**
 * Servlet Utility class.
 */
@Slf4j
public final class ServletUtils {

  /**
   * Pattern for parameterized url in EndpointConfig.url property.
   */
  public static final Pattern URL_PARAMETER_PATTERN = Pattern.compile("\\$\\{([a-zA-Z]+)}");

  /**
   * Private constructor.
   */
  private ServletUtils() {
    throw new UnsupportedOperationException("Utility class can't be instantiated.");
  }

  /**
   * Deserialize POST body.
   *
   * @param <T>     generic model class
   * @param type    the specific genericized type of model class
   * @param request HTTP request.
   * @return POST body model
   */
  public static <T> T getPostBody(final Type type, final SlingHttpServletRequest request) {
    T body = null;
    try {
      body = JsonUtils.deserialize(type, request.getInputStream(), log);
    } catch (Exception e) {
      log.error("Unable to retrieve InputStream for type = {}: ", type.getTypeName(), e);
    }
    return body;
  }

  /**
   * Insert parameters from given map into url string using pattern.
   *
   * @param url     url with [potential] parameters
   * @param headers map with parameters values
   * @return url with all parameters inserted
   */
  public static String insertParameters(final String url, final Map<String, String> headers) {
    if (!url.contains(DOLLAR)) {
      // quick test to avoid the use of pattern
      return url;
    }
    Matcher m = URL_PARAMETER_PATTERN.matcher(url);
    StringBuffer sb = new StringBuffer();
    while (m.find()) {
      String found = m.group(1);
      String replacement = headers.get(found);
      if (StringUtils.isNotEmpty(replacement)) {
        headers.remove(found);
        m.appendReplacement(sb, replacement);
      } else {
        log.error("No replacement value for parameter [{}] in url [{}] found", found, url);
      }
    }
    m.appendTail(sb);
    return sb.toString();
  }

  /**
   * Extract Integer value based on the given query parameter name.
   *
   * @param request Sling HTTP request
   * @param name    name of parameter
   * @return Integer value for the given parameter or null in case it absent or in wrong format
   */
  public static Integer getIntegerValue(final SlingHttpServletRequest request, final String name) {
    String param = request.getParameter(name);
    if (StringUtils.isNotEmpty(param)) {
      try {
        return Integer.parseInt(param);
      } catch (NumberFormatException e) {
        log.error("Wrong query param format: name=[{}], value=[{}]", name, param);
      }
    }
    return null;
  }

  /**
   * Get datasource children as stream.
   *
   * @param request Sling HTTP request
   * @return Children as resource stream
   */
  public static Stream<Resource> getDataSourceResourceStream(
      final SlingHttpServletRequest request) {
    ResourceResolver resolver = request.getResourceResolver();
    return Optional.ofNullable(request.getResource().getChild("datasource"))
        .map(Resource::getValueMap).map(valueMap -> valueMap.get("path", String.class))
        .filter(StringUtils::isNotBlank).map(resolver::getResource).map(Resource::getChildren)
        .map(res -> StreamSupport.stream(res.spliterator(), false)).orElse(Stream.empty());
  }

  public static String extractLocale(String path) {
    return LanguageUtil.getLanguageRoot(path).replace(TONOMUS_CONTENT_PATH + SLASH, EMPTY);
  }
}
