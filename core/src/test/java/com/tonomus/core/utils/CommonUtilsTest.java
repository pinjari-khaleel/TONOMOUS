package com.tonomus.core.utils;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.tonomus.core.constants.Constants;

import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.tonomus.core.constants.NumberConstants.ONE;
import static com.tonomus.core.utils.CommonUtils.PROP_DOMAIN_NAME;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CommonUtilsTest {

  private static final String TEST_STRING = "Test\r\nString";

  private static final String EXPECTED_STRING = "Test<br/>String";

  @Mock
  ResourceResolverFactory resourceResolverFactory;
  @Mock
  ResourceResolver resourceResolver;

  @Test void testStringReplaceWithHtmlLineBreaks() {
    assertEquals(EXPECTED_STRING, CommonUtils.replaceWithHtmlTags(TEST_STRING));
  }

  @Test void testNullReplaceWithHtmlLineBreaks() {
    assertNull(CommonUtils.replaceWithHtmlTags(null));
  }

  @Test void getResourceResolver() throws LoginException {
    Map<String, Object> authInfo =
        Collections.singletonMap(ResourceResolverFactory.SUBSERVICE, Constants.SERVICE_USER_NAME);
    when(resourceResolverFactory.getServiceResourceResolver(authInfo)).thenReturn(resourceResolver);
    CommonUtils.getResourceResolver(resourceResolverFactory);
    verify(resourceResolverFactory, times(1)).getServiceResourceResolver(authInfo);
  }

  @Test void testIsAdminPage() {
    assertTrue(CommonUtils.isAdminPage("/content/neom/ar-sa/conf/admin"));
    assertTrue(CommonUtils.isAdminPage("/content/neom/ar-sa/conf/admin/some-page"));
    assertFalse(CommonUtils.isAdminPage("/content/neom/ar-sa/some-page"));
    assertFalse(CommonUtils.isAdminPage("/content/neom/ar-sa/some-page/page"));
  }

  @Test
  public void testGetFormattedDateYYYYMMDD_Arabic() {
    String date = "2022-12-31";
    LocalDate localDate = LocalDate.parse(date);
    DateTimeFormatter dateTimeFormatter =
        DateTimeFormatter.ofPattern("d MMMM, yyyy", new Locale("ar"));
    String expectedDate = localDate.format(dateTimeFormatter);
    String actualDate = CommonUtils.getFormattedDateYYYYMMDD(date, new Locale("ar"));
    assertEquals(expectedDate, actualDate);
  }

  @Test
  public void testGetFormattedDateYYYYMMDD_NonArabic() throws Exception {
    String date = "2022-12-31";
    Date dt = new SimpleDateFormat("yyyy-MM-dd").parse(date);
    String expectedDate = new SimpleDateFormat("MMMM d, yyyy").format(dt);
    String actualDate = CommonUtils.getFormattedDateYYYYMMDD(date, Locale.ENGLISH);
    assertEquals(expectedDate, actualDate);
  }

  @Test
  public void testGetFormattedDateYYYYMMDD_ParseException() {
    String date = "invalid-date";
    String actualDate = CommonUtils.getFormattedDateYYYYMMDD(date, Locale.ENGLISH);
    assertNull(actualDate);
  }

  @Test
  void testWriteJSONWithObject() throws IOException {
    SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);

    CommonUtils.writeJSON(response, 200, Collections.singletonMap("key", "value"));

    assertEquals("{\"key\":\"value\"}", stringWriter.toString());
  }

  @Test
  void testWriteJSONWithString() throws IOException {
    SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);

    CommonUtils.writeJSON(response, 200, "{\"key\":\"value\"}");

    assertEquals("{\"key\":\"value\"}", stringWriter.toString());
  }

  @Test
  void testPaginate() {
    List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    List<Integer> paginatedList = CommonUtils.paginate(list, 2, 5);

    assertEquals(Arrays.asList(3, 4, 5, 6, 7), paginatedList);
  }

  @Test
  void testGetFormattedEventTrackingDate() {
    Date date = new Date();
    Locale locale = new Locale("en", "US");
    String formattedDate = CommonUtils.getFormattedEventTrackingDate(date, locale);

    // Assuming Constants.DATE_FORMAT_DATA_LAYER = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    String expectedDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(date);

    assertEquals(expectedDate, formattedDate);
  }

  @Test
  public void testGetSiteDomainName() {
    Resource resource = mock(Resource.class);
    ResourceResolver resourceResolver = mock(ResourceResolver.class);
    PageManager pageManager = mock(PageManager.class);
    Page page = mock(Page.class);
    Page rootPage = mock(Page.class);
    Resource contentResource = mock(Resource.class);
    ValueMap valueMap = mock(ValueMap.class);

    when(resource.getResourceResolver()).thenReturn(resourceResolver);
    when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
    when(pageManager.getContainingPage(resource)).thenReturn(page);
    when(page.getAbsoluteParent(ONE)).thenReturn(rootPage);
    when(rootPage.getContentResource()).thenReturn(contentResource);
    when(contentResource.getValueMap()).thenReturn(valueMap);
    when(valueMap.get(PROP_DOMAIN_NAME, Constants.TONOMUS_SITE)).thenReturn("testDomain");

    String domainName = CommonUtils.getSiteDomainName(resource);

    assertEquals("testDomain", domainName);
  }

  @Test
  public void testGetFullPagePath() {
    Resource resource = mock(Resource.class);
    ResourceResolver resourceResolver = mock(ResourceResolver.class);
    PageManager pageManager = mock(PageManager.class);
    Page page = mock(Page.class);
    Page rootPage = mock(Page.class);
    Resource contentResource = mock(Resource.class);
    ValueMap valueMap = mock(ValueMap.class);

    when(resource.getResourceResolver()).thenReturn(resourceResolver);
    when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
    when(pageManager.getContainingPage(resource)).thenReturn(page);
    when(page.getAbsoluteParent(ONE)).thenReturn(rootPage);
    when(rootPage.getContentResource()).thenReturn(contentResource);
    when(contentResource.getValueMap()).thenReturn(valueMap);
    when(valueMap.get(PROP_DOMAIN_NAME, Constants.TONOMUS_SITE)).thenReturn("testDomain");
    when(page.getPath()).thenReturn("/content/testPagePath");

    String fullPagePath = CommonUtils.getFullPagePath(resource);

    assertEquals("https://testDomain/content/testPagePath", fullPagePath);
  }
}