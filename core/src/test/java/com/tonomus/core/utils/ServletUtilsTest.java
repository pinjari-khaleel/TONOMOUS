package com.tonomus.core.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;

import com.google.gson.reflect.TypeToken;

import org.apache.sling.api.SlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ServletUtilsTest {

  private Map<String, String> headers;
  private String url;

  @BeforeEach void setUp() {
    headers = new HashMap<>();
    headers.put("domainCode", "eukdlx");
  }

  @Test void insertParameters_noParameters_noSubstitutions() {
    url = "https://api-preprod.deco-columbus.com/api/scrapbooks";
    headers.put("scrapbookId", "12345");
    assertEquals(url, ServletUtils.insertParameters(url, headers));
    assertEquals(2, headers.size());
  }

  @Test void insertParameters_oneParameter_oneSubstitution() {
    url = "https://api-preprod.deco-columbus.com/api/scrapbooks/${scrapbookId}";
    headers.put("scrapbookId", "12345");
    assertEquals("https://api-preprod.deco-columbus.com/api/scrapbooks/12345",
        ServletUtils.insertParameters(url, headers));
    assertEquals(1, headers.size());
  }

  @Test void insertParameters_wrongParameter_noSubstitutions() {
    url = "https://api-preprod.deco-columbus.com/api/scrapbooks/${scrapbookId}";
    headers.put("itemId", "12345");
    assertEquals(url, ServletUtils.insertParameters(url, headers));
    assertEquals(2, headers.size());
  }

  @Mock
  private SlingHttpServletRequest request;

  @Test
  void testGetPostBody() throws IOException {
    // Test when body is successfully deserialized
    Type type = new TypeToken<YourType>() {
    }.getType();

    YourType expected = new YourType();
    expected.setKey("value");
    String jsonString = "{\"name\": \"John\", \"value\": 30}";
    ServletInputStream inputStream = new ServletInputStream() {
      private ByteArrayInputStream byteArrayInputStream =
          new ByteArrayInputStream(jsonString.getBytes());

      @Override
      public int read() throws IOException {
        return byteArrayInputStream.read();
      }

      @Override
      public boolean isFinished() {
        return byteArrayInputStream.available() == 0;
      }

      @Override
      public boolean isReady() {
        return true; // Always ready to be read
      }

      @Override
      public void setReadListener(ReadListener readListener) {
        // Not required for this implementation
      }
    };
    when(request.getInputStream()).thenReturn(inputStream);
    assertNotNull(ServletUtils.getPostBody(type, request));
  }

  @Test
  void testGetIntegerValue() {

    // Set up the mock behavior
    when(request.getParameter("param1")).thenReturn("42");
    when(request.getParameter("param2")).thenReturn("invalid");

    // Test case 1: Valid integer parameter
    Integer result1 = ServletUtils.getIntegerValue(request, "param1");
    assertEquals(42, result1);

    // Test case 2: Invalid integer parameter
    Integer result2 = ServletUtils.getIntegerValue(request, "param2");
    assertNull(result2);

    // Verify that the mock was called with the correct parameters
    verify(request, times(2)).getParameter(anyString());
  }


  private static class YourType {
    private String key;

    public String getKey() {
      return key;
    }

    public void setKey(String key) {
      this.key = key;
    }
  }
}