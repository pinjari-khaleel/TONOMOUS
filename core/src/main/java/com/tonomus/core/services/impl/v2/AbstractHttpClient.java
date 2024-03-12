package com.tonomus.core.services.impl.v2;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.tonomus.core.utils.JsonUtils;
import com.tonomus.core.utils.ServletUtils;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.HttpResponseInterceptor;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.http.protocol.HttpContext;

import static com.tonomus.core.constants.Constants.DATE_FORMAT_JSON;
import static com.tonomus.core.constants.Constants.ERROR_ABSTRACTHTTPCLIENT;
import static java.util.Objects.nonNull;

/**
 * Class contains context-independent methods related to HttpClient.
 */
@Slf4j
public abstract class AbstractHttpClient {

  /**
   * Response status 500.
   */
  private static final int INTERNAL_SERVER_ERROR_STATUS = 500;
  /**
   * Timeout (in milliseconds).
   */
  private static final int TIMEOUT = 10000;

  /**
   * Number of retries if timeout happened.
   */
  private static final int MAX_RETRIES = 5;

  /**
   * Inject HttpClientBuilderFactory.
   *
   * @return HttpClientBuilderFactory instance
   */
  protected abstract HttpClientBuilderFactory getHttpClientBuilderFactory();

  /**
   * Adds URI with or without query parameters to a given class.
   *
   * @param <T>         generic type for {@link HttpRequestBase}
   * @param base        given implementation of {@link HttpRequestBase}
   * @param url         root URL
   * @param headers     http headers map for request
   * @param queryParams query parameters (optional)
   * @return given class enriched with URI
   * @throws URISyntaxException in case of errors in URI syntax
   */
  protected <T extends HttpRequestBase> T getHttpRequestBase(T base, String url,
      Map<String, String> headers, List<NameValuePair> queryParams) throws URISyntaxException {

    // special case of parameterized url
    url = ServletUtils.insertParameters(url, headers);

    if (CollectionUtils.isNotEmpty(queryParams)) {
      base.setURI(new URIBuilder(url).setParameters(queryParams).build());
    } else {
      base.setURI(new URI(url));
    }
    return base;
  }

  /**
   * Inserts payload for POST, PUT requests.
   *
   * @param base    HttpEntityEnclosingRequestBase: HttpPost, HttpPut
   * @param payload payload for the request
   */
  protected void addPayload(final HttpEntityEnclosingRequestBase base, final String payload) {
    base.setEntity(new StringEntity(payload, ContentType.APPLICATION_JSON));
  }

  /**
   * Inserts payload with "application/x-www-form-urlencoded" content type.
   * @param base HttpEntityEnclosingRequestBase: HttpPost, HttpPut
   * @param payload payload for the request
   */
  protected void addPayload(final @NonNull HttpEntityEnclosingRequestBase base,
      final @NonNull Map<String, String> payload) {
    List<NameValuePair> params = payload.entrySet().stream()
        .map(entry -> new BasicNameValuePair(entry.getKey(), entry.getValue()))
        .collect(Collectors.toList());
    base.setEntity(new UrlEncodedFormEntity(params, StandardCharsets.UTF_8));
  }

  /**
   * General method for processing GET/POST etc. requests.
   * In a special case when String.class is to be a response class,
   * returns string representation of response.
   *
   * @param <T>             generic model class
   * @param type            the specific genericized type of model class
   * @param httpRequestBase prepared request
   * @return wrapped endpoint response with response metadata and an instance of a given generic
   * class; or null in case of exceptions
   */
  protected <T> EndpointResponse<T> executeRequest(Type type, HttpRequestBase httpRequestBase) {
    try (CloseableHttpClient httpClient = getHttpClient()) {
      CloseableHttpResponse response = httpClient.execute(httpRequestBase);

      // responseCode
      int responseCode = response.getStatusLine().getStatusCode();
      EndpointResponse<T> endpointResponse = new EndpointResponse<>(responseCode);

      // data
      if (response.getEntity() != null && response.getEntity().getContent() != null) {
        InputStream responseStream = response.getEntity().getContent();
        if ((type instanceof Class<?>) && String.class.getName().equals(type.getTypeName())) {
          endpointResponse.setData((T) IOUtils.toString(responseStream, StandardCharsets.UTF_8));
        } else {
          endpointResponse.setData(
              JsonUtils.deserialize(type, responseStream, DATE_FORMAT_JSON, log));
        }
      }      
      return endpointResponse;
    } catch (Exception e) {
      log.error(ERROR_ABSTRACTHTTPCLIENT + "Exception occur while executing request. {}", e.getMessage());
      return null;
    }
  }

  /**
   * This method returns the CloseableHttpClient instance with provided timeout.
   *
   * @return CloseableHttpClient instance
   */
  protected CloseableHttpClient getHttpClient() {
    RequestConfig requestConfig =
        RequestConfig.copy(RequestConfig.DEFAULT)
            .setSocketTimeout(TIMEOUT)
            .setConnectTimeout(TIMEOUT)
            .setConnectionRequestTimeout(TIMEOUT)
            .build();
    return getHttpClientBuilderFactory().newBuilder().setDefaultRequestConfig(requestConfig)
        .setRetryHandler(retryHandler())
        .addInterceptorLast(new HttpResponseInterceptor() {
          @Override
          public void process(HttpResponse response, HttpContext context) throws IOException {
            if (response.getStatusLine().getStatusCode() == INTERNAL_SERVER_ERROR_STATUS) {
              throw new IOException(ERROR_ABSTRACTHTTPCLIENT + "Retry request submission request failed. Response code:" + INTERNAL_SERVER_ERROR_STATUS);
            }
          }
        }).build();
  }

  /**
   * This method returns the HttpRequestRetryHandler instance with retry handler.
   *
   * @return HttpRequestRetryHandler instance
   */
  private static HttpRequestRetryHandler retryHandler() {
    return (exception, executionCount, context) -> nonNull(exception)
        && executionCount <= MAX_RETRIES;
  }
}
