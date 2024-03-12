package com.tonomus.core.services.impl.v2;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.lang.reflect.Type;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponseInterceptor;
import org.apache.http.ProtocolVersion;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicStatusLine;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AbstractHttpClientTest {

  @Mock
  private HttpClientBuilder httpClientBuilder;
  
  @Mock
  private HttpClientBuilderFactory httpClientBuilderFactory;

  @Mock
  private CloseableHttpClient closeableHttpClient;

  @Mock
  private CloseableHttpResponse closeableHttpResponse;

  @Mock
  private HttpEntity httpEntity;

  private AbstractHttpClient abstractHttpClient;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.initMocks(this);
    abstractHttpClient = new AbstractHttpClient() {
      @Override
      protected HttpClientBuilderFactory getHttpClientBuilderFactory() {
        return httpClientBuilderFactory;
      }
    };
  }

  @Test
  void testExecuteRequest() throws Exception {
    HttpClientBuilder httpClientBuilder = mock(HttpClientBuilder.class);
    when(httpClientBuilderFactory.newBuilder()).thenReturn(httpClientBuilder);
    when(httpClientBuilder.build()).thenReturn(closeableHttpClient);
    when(httpClientBuilder.setDefaultRequestConfig(any())).thenReturn(httpClientBuilder);
    when(httpClientBuilder.setRetryHandler(any())).thenReturn(httpClientBuilder);
    when(httpClientBuilder.addInterceptorLast(any(HttpResponseInterceptor.class))).thenReturn(
        httpClientBuilder);

    when(closeableHttpClient.execute(any(HttpGet.class))).thenReturn(closeableHttpResponse);
    ProtocolVersion protocolVersion = new ProtocolVersion("HTTP", 1, 1);
    when(closeableHttpResponse.getStatusLine()).thenReturn(
        new BasicStatusLine(protocolVersion, 200, "OK"));
    when(closeableHttpResponse.getEntity()).thenReturn(httpEntity);

    String responseContent = "{\"key\":\"value\"}";
    InputStream stream = new ByteArrayInputStream(responseContent.getBytes());
    when(httpEntity.getContent()).thenReturn(stream);

    Type type = String.class;
    HttpGet httpRequestBase = new HttpGet("http://test.com");

    EndpointResponse<String> result = abstractHttpClient.executeRequest(type, httpRequestBase);

    assertNotNull(result);
    assertEquals(200, result.getResponseCode());
    assertEquals("{\"key\":\"value\"}", result.getData());
  }
}