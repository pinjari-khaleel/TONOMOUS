package com.tonomus.core.servlets.search;

import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.ServletException;

import com.google.gson.JsonParser;
import com.tonomus.core.services.v2.SearchResultService;
import com.tonomus.core.servlets.forms.TestUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import junitx.util.PrivateAccessor;

import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.testing.mock.sling.MockXSSAPIImpl;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.xss.XSSAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static javax.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
import static javax.servlet.http.HttpServletResponse.SC_OK;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
class SearchServletTest {

  private final TestLogger testLogger = TestLoggerFactory.getTestLogger(SearchServlet.class);

  private SearchServlet searchServlet;

  private SearchResultService searchResultService;

  @BeforeEach
  void setUp(AemContext context) throws IOException, NoSuchFieldException {
    searchServlet = new SearchServlet();
    searchResultService = mock(SearchResultService.class);
    XSSAPI xssapi = new MockXSSAPIImpl();

    context.registerService(searchResultService);
    context.registerService(xssapi);

    PrivateAccessor.setField(searchServlet, "searchResultService", searchResultService);
    PrivateAccessor.setField(searchServlet, "xssapi", xssapi);
  }

  @Test
  void testDoPost_ThrowException(AemContext context) throws ServletException, IOException {
    SlingHttpServletResponse response = context.response();
    searchServlet.doGet(context.request(), response);
    assertEquals("ERROR_TONOMUS(V2)_008: Exception occurred while processing POST request.",
        TestUtils.getLastLogEvent(testLogger).getMessage());
    assertEquals(SC_INTERNAL_SERVER_ERROR, response.getStatus());
  }

  @Test
  void testDoGet_WithoutQueryParam(AemContext context) throws IOException, ServletException {
    MockSlingHttpServletRequest request = context.request();
    Locale locale = new Locale("en", "us");
    request.setLocale(locale);
    request.addRequestParameter("query", null);

    SlingHttpServletResponse response = context.response();
    searchServlet.doGet(request, response);
    assertEquals("ERROR_TONOMUS(V2)_008: Exception occurred while processing POST request.",
        TestUtils.getLastLogEvent(testLogger).getMessage());
    assertEquals(SC_INTERNAL_SERVER_ERROR, response.getStatus());
  }

  @Test
  void testDoGet_WithResults(AemContext context) throws IOException, ServletException {
    String payload = "{" +
        "\"totalResults\": 2," +
        "\"results\": [" +
          "{" +
              "\"path\": \"/content/tonomus/en-us/somepath/qa/cognitive-test\"," +
              "\"title\": \"Cognitive Test\"," +
              "\"description\": \"Lorem ipsum\"" +
          "},{" +
              "\"path\": \"/content/tonomus/en-us/cognitive-solutions\"," +
              "\"title\": \"Cognitive Solutions\"," +
              "\"description\": \"Cognitive Solution\"" +
          "}" +
        "]}";
    MockSlingHttpServletRequest request = context.request();
    Locale locale = new Locale("ar", "sa");
    request.setLocale(locale);
    request.addRequestParameter("query", "cognitive");

    doReturn(JsonParser.parseString(payload).getAsJsonObject()).when(searchResultService)
        .searchResultFullTextOnPDFAssetsAndPages(any(), anyString(), anyString());
    SlingHttpServletResponse response = context.response();
    searchServlet.doGet(request, response);
    assertEquals(SC_OK, response.getStatus());
  }
}