package com.tonomus.core.services.impl;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.NameValuePair;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class NeomFormsCollectorServiceImplTest {

  NeomFormsCollectorServiceImpl.Configuration configuration;
  NeomFormsCollectorServiceImpl.Configuration configuration2;
  HttpEntityEnclosingRequestBase base;
  NeomFormsCollectorServiceImpl service;

  String[] fields = {"field1", "field2"};

  @BeforeEach void setUp() {
    configuration = mock(NeomFormsCollectorServiceImpl.Configuration.class);
    configuration2 = mock(NeomFormsCollectorServiceImpl.Configuration.class);

    base = new HttpEntityEnclosingRequestBase() {
      @Override public String getMethod() {
        return "POST";
      }
    };

    lenient().when(configuration2.mandatoryFields()).thenReturn(fields);

    service = new NeomFormsCollectorServiceImpl();
  }

  @Test
  void testEmptyActivate() {
    service.activate(configuration);
    assertNull(configuration.mandatoryFields());
  }

  @Test
  void testActivate() {
    service.activate(configuration2);
    assertNotNull(configuration2.mandatoryFields());
  }

  @Test
  void testSendFormDataThrowsException() {
    service.activate(configuration2);
    String uri = "https://abc.com";
    Map<String, Object> data = new HashMap<>();
    data.put("test", "test");

    assertThrows(IllegalArgumentException.class, () -> service.sendFormData(uri, data));
    assertThrows(NullPointerException.class, () -> service.sendFormData(null, null));
    assertThrows(NullPointerException.class, () -> service.sendFormData(uri, null));
  }

  @Test
  void testSendFormData() {
    service.activate(configuration2);
    String uri = "https://abc.com";
    Map<String, Object> data = new HashMap<>();
    data.put("field1", "test1");
    data.put("field2", "test2");

    EndpointResponse<String> response = service.sendFormData(uri, data);
    assertNull(response);
  }

  @Test
  void testAddPayloadMap() {
    service.activate(configuration2);
    Map<String, String> payload = new HashMap<>();
    payload.put("field1", "test1");
    payload.put("field2", "test2");

    service.addPayload(base, payload);
    assertNotNull(base.getEntity());
  }

  @Test
  void testAddPayload() {
    service.activate(configuration2);
    service.addPayload(base, "test");
    assertNotNull(base.getEntity());
  }

  @Test
  void testGetHttpRequestBase() throws URISyntaxException {
    String uri = "https://abc.com";
    Map<String, String> headers = new HashMap<>();
    headers.put("header1", "test1");
    headers.put("header2", "test2");

    List<NameValuePair> queryParams = new ArrayList<>();
    assertNotNull(service.getHttpRequestBase(base, uri, headers, queryParams));

    NameValuePair nameValuePair = new NameValuePair() {
      @Override public String getName() {
        return "Name";
      }

      @Override public String getValue() {
        return "Value";
      }
    };

    queryParams.add(nameValuePair);
    assertNotNull(service.getHttpRequestBase(base, uri, headers, queryParams));
  }
}
