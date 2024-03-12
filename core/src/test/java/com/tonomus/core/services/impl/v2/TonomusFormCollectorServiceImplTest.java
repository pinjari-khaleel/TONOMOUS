package com.tonomus.core.services.impl.v2;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import junitx.util.PrivateAccessor;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.NameValuePair;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tonomus.core.services.v2.TonomusFormCollectorConfigService;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
class TonomusFormCollectorServiceImplTest {

  HttpEntityEnclosingRequestBase base;
  TonomusFormCollectorServiceImpl service;

  String[] fields = { "field1", "field2" };

  @BeforeEach
  void setUp() throws NoSuchFieldException {
    base = new HttpEntityEnclosingRequestBase() {
      @Override
      public String getMethod() {
        return "POST";
      }
    };

    service = new TonomusFormCollectorServiceImpl();
    TonomusFormCollectorConfigService tonomusFormCollectorConfigService = mock(TonomusFormCollectorConfigService.class);
    PrivateAccessor.setField(service, "tonomusFormCollectorConfigService",
        tonomusFormCollectorConfigService);
    lenient().when(tonomusFormCollectorConfigService.getUrl()).thenReturn("http://test.com");
    lenient().when(tonomusFormCollectorConfigService.getMandatoryFields()).thenReturn(Arrays.asList(fields));
  }

  @Test
  void testSendFormDataThrowsException() {
    Map<String, Object> data = new HashMap<>();
    data.put("test", "test");
    assertThrows(IllegalArgumentException.class, () -> service.sendFormData(data));
    assertThrows(NullPointerException.class, () -> service.sendFormData(null));
  }

  @Test
  void testSendFormData() {
    Map<String, Object> data = new HashMap<>();
    data.put("field1", "test1");
    data.put("field2", "test2");

    EndpointResponse<String> response = service.sendFormData(data);
    assertNull(response);
  }

  @Test
  void testAddPayloadMap() {
    Map<String, String> payload = new HashMap<>();
    payload.put("field1", "test1");
    payload.put("field2", "test2");

    service.addPayload(base, payload);
    assertNotNull(base.getEntity());
  }

  @Test
  void testAddPayload() {
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
      @Override
      public String getName() {
        return "Name";
      }

      @Override
      public String getValue() {
        return "Value";
      }
    };

    queryParams.add(nameValuePair);
    assertNotNull(service.getHttpRequestBase(base, uri, headers, queryParams));
  }
}
