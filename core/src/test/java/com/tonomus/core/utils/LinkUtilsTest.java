package com.tonomus.core.utils;

import com.day.cq.commons.feed.Feed;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.oak.commons.PathUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;


class LinkUtilsTest {

  private static final String TEST_PATH = "/content/neom/en/test";

  private static final String EXTENSION_TEST_PATH = TEST_PATH + Feed.SUFFIX_HTML;

  private static final String TEST_PATH_WITH_ID = "/content/neom/en/test#id";

  private static final String EXTENSION_TEST_PATH_WITH_ID = "/content/neom/en/test.html#id";
  private static final String PAGE_PATH_WITH_EXTENSION = "/content/mypage.html";
  private static final String PAGE_PATH_WITHOUT_EXTENSION = "/content/mypage";
  private static final String PAGE_PATH_WITH_QUERY_PARAMS = "/content/mypage?param=value";

  @Test
  void testGetJcrPathWithoutExtension() {
    // Test case 1: Page path with extension
    String result1 = LinkUtils.getJcrPathWithoutExtension(PAGE_PATH_WITH_EXTENSION);
    assertEquals(PAGE_PATH_WITHOUT_EXTENSION, result1);

    // Test case 2: Page path with query parameters
    String result2 = LinkUtils.getJcrPathWithoutExtension(PAGE_PATH_WITH_QUERY_PARAMS);
    assertEquals(PAGE_PATH_WITHOUT_EXTENSION, result2);

    // Test case 3: Page path without extension
    String result3 = LinkUtils.getJcrPathWithoutExtension(PAGE_PATH_WITHOUT_EXTENSION);
    assertEquals(PAGE_PATH_WITHOUT_EXTENSION, result3);
  }

  @Test void testIsInternalLinkWithNullPath() {
    assertFalse(LinkUtils.isInternalLink(null));
  }

  @Test void testIsInternalLinkWithEmptyPath() {
    assertFalse(LinkUtils.isInternalLink(""));
  }

  @Test void testIsInternalLinkWithPageUrl() {
    assertFalse(LinkUtils.isInternalLink(EXTENSION_TEST_PATH));
  }

  @Test void testIsInternalLinkWithPagePath() {
    assertTrue(LinkUtils.isInternalLink(TEST_PATH));
  }

  @Test void testIsInternalLinkWithExternalUrl() {
    assertFalse(LinkUtils.isInternalLink("https://www.dummy-url.com"));
  }

  @Test void testGetExtensionUrlWithNull() {
    assertNull(LinkUtils.getUrlWithExtension(null));
  }

  @Test void testGetExtensionUrlWithEmptyUrl() {
    assertEquals("", LinkUtils.getUrlWithExtension(""));
  }

  @Test void testGetExtensionUrlWithPagePath() {
    assertEquals(EXTENSION_TEST_PATH, LinkUtils.getUrlWithExtension(TEST_PATH));
  }

  @Test void testGetExtensionUrlWithPageUrl() {
    assertEquals(EXTENSION_TEST_PATH, LinkUtils.getUrlWithExtension(EXTENSION_TEST_PATH));
  }

  @Test void testGetExtensionUrlWithExternalUrl() {
    assertEquals("https://www.dummy-url.com",
        LinkUtils.getUrlWithExtension("https://www.dummy-url.com"));
  }

  @Test void testGetExtensionUrlWithPageUrlAndId() {
    assertEquals(EXTENSION_TEST_PATH_WITH_ID, LinkUtils.getUrlWithExtension(TEST_PATH_WITH_ID));
  }

  @Test
  void testExternalizeUrlWhenNull() {
    assertEquals(StringUtils.EMPTY, LinkUtils.externalizeUrl(null));
  }

  @Test
  void testExternalizeUrlWhenEmpty() {
    assertEquals(StringUtils.EMPTY, LinkUtils.externalizeUrl(StringUtils.EMPTY));
  }

  @Test
  void testExternalizeUrlWhenExternal() {
    final String externalPath = "/en-us/path/to/page";
    assertEquals(externalPath, LinkUtils.externalizeUrl(externalPath));
  }

  @Test
  void testExternalizeUrlWhenInternal() {
    final String externalPath = "path/to/page";
    final String internalPath = PathUtils.concat("/content/neom", externalPath);
    assertEquals("/" + externalPath, LinkUtils.externalizeUrl(internalPath));
  }
}
