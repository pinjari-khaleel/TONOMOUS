package com.tonomus.core.servlets.forms.v2.helper;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.tonomus.core.services.v2.FormFactoryConfigService;
import com.tonomus.core.utils.LangUtils;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.xss.XSSAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TonomusFormsCollectorRequestBuilderTest {

  private static final String VALUE1 = "value1";

  private static final String VALUE2 = "value2";

  private FormRequestParameterMap formRequestParameterMap;

  private FormRequest formRequest;

  private FormFactoryConfigService formFactoryConfigService;

  private XSSAPI xssapi;

  @BeforeEach
  void setUp() {
    formRequestParameterMap = mock(FormRequestParameterMap.class);
    formRequest = mock(FormRequest.class);
    formFactoryConfigService = mock(FormFactoryConfigService.class);
    xssapi = mock(XSSAPI.class);
  }

  @Test
  void testBuild_whenNoFormIDIsConfigured() {
    when(formRequest.getParameterMap()).thenReturn(formRequestParameterMap);
    when(formRequestParameterMap.getFormId()).thenReturn("form_id");
    assertThrows(NullPointerException.class, () -> new TonomusFormsCollectorRequestBuilder(formRequest,
    formFactoryConfigService, StringUtils.EMPTY));
  }

  @Test
  void testBuild_whenAllParametersAreSet() {
    when(formFactoryConfigService.getConfig(anyString())).thenReturn(formFactoryConfigService);
    when(formRequest.getParameterMap()).thenReturn(formRequestParameterMap);
    when(formRequestParameterMap.getFormId()).thenReturn("form_id");
    when(xssapi.encodeForHTML(anyString())).then(val -> val.getArgument(0));
    MultiKeyMap<String, String> multiKeyMap = new MultiKeyMap<>();
    multiKeyMap.put(LangUtils.ENGLISH_LANGUAGE, "*", VALUE2);
    when(formFactoryConfigService.getAudienceIds()).thenReturn(multiKeyMap);
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put("contact-permission",
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter("no")), xssapi));
    requestParameters.put("lang_code",
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter("en")), xssapi));
    requestParameters.put("country",
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter("Saudi Arabia")), xssapi));
    requestParameters.put(TonomusFormsCollectorRequestBuilder.COOKIE_GA,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter("somecookie_ga")), xssapi));
    requestParameters.put(TonomusFormsCollectorRequestBuilder.COOKIE_ECID,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter("somecookie_ecid")), xssapi));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    TonomusFormsCollectorRequestBuilder underTest = new TonomusFormsCollectorRequestBuilder(formRequest,
        formFactoryConfigService, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertNotNull(data);
  }

  @Test
  void testBuild_whenNoPhoneCodeAndNoLandCodeAndContactPermissionsAreSet() {
    when(formFactoryConfigService.getConfig(anyString())).thenReturn(formFactoryConfigService);
    when(formRequest.getParameterMap()).thenReturn(formRequestParameterMap);
    when(formRequestParameterMap.getFormId()).thenReturn("form_id");
    MultiKeyMap<String, String> multiKeyMap = new MultiKeyMap<>();
    multiKeyMap.put(LangUtils.ENGLISH_LANGUAGE, "*", VALUE2);
    when(formFactoryConfigService.getAudienceIds()).thenReturn(multiKeyMap);
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    when(formRequest.getCookieValue(TonomusFormsCollectorRequestBuilder.COOKIE_GA))
        .thenReturn(Optional.of(VALUE1));
    when(formRequest.getCookieValue(TonomusFormsCollectorRequestBuilder.COOKIE_ECID)).thenReturn(Optional.of(VALUE2));
    TonomusFormsCollectorRequestBuilder underTest = new TonomusFormsCollectorRequestBuilder(formRequest,
        formFactoryConfigService, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertNotNull(data);
  }

}