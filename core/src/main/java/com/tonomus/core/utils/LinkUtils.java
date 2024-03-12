package com.tonomus.core.utils;


import java.util.Objects;
import java.util.Optional;

import com.day.cq.commons.feed.Feed;
import com.tonomus.core.constants.Constants;

import org.apache.commons.lang3.StringUtils;

import static com.tonomus.core.constants.Constants.QUESTION_MARK;

/**
 * This class contains Link/URL utility methods.
 */
public final class LinkUtils {

  /**
   * Hide constructor.
   */
  private LinkUtils() { }
  /**
   * This method takes the page path as parameter and appends the .html extension if required. If
   * page path contains #id then it adds the .html extension and then appends the #id.
   *
   * @param pagePath Page Path.
   * @return String path as URL
   */
  public static String getUrlWithExtension(final String pagePath) {
    if (isInternalLink(pagePath) && !pagePath.contains(Feed.SUFFIX_HTML)) {
      if (StringUtils.contains(pagePath, Constants.HASH)) {
        return StringUtils.substringBefore(pagePath, Constants.HASH) + Feed.SUFFIX_HTML
            + Constants.HASH + StringUtils.substringAfter(pagePath, Constants.HASH);
      } else {
        return pagePath + Feed.SUFFIX_HTML;
      }
    }
    return pagePath;
  }

  /**
   * This method checks that if the provided path is Internal link or not.
   *
   * @param path link/path that needs to be tested
   * @return true: for Internal URL, and false for External URL
   */
  public static boolean isInternalLink(final String path) {
    return (Objects.nonNull(path) && !path.contains(Constants.DOT) && path
        .contains(Constants.SLASH + Constants.CONTENT_LABEL));
  }

  /**
   * This method takes the page path as parameter and removes the .html extension
   * and query params if present.
   *
   * @param pagePath Page Path.
   * @return String path as URL
   */
  public static String getJcrPathWithoutExtension(String pagePath) {
    if (isJcrPath(pagePath)) {
      int index = pagePath.indexOf(Feed.SUFFIX_HTML);
      if (index >= 0) {
        pagePath = pagePath.substring(0, index);
      }
      index = pagePath.indexOf(QUESTION_MARK);
      if (index >= 0) {
        pagePath = pagePath.substring(0, index);
      }
    }
    return pagePath;
  }

  /**
   * Removes /content/tonomus from the url.
   *
   * @param url page url
   * @return the externalized url
   */
  public static String externalizeUrl(String url) {
    return Optional.ofNullable(url)
        .map(path -> path.replaceAll("/content/([^/]+)([^.]*)", "$2"))
        .orElse(StringUtils.EMPTY);
  }

  /**
   * This method checks that if the provided path is JCR path or not.
   *
   * @param path link/path that needs to be tested
   * @return true: for JCR path, and false otherwise
   */
  private static boolean isJcrPath(final String path) {
    return Objects.nonNull(path) && path.startsWith(Constants.SLASH + Constants.CONTENT_LABEL);
  }
}
