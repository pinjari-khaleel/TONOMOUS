package com.tonomus.core.servlets.forms;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.tonomus.core.config.FormAudienceOptions;
import com.tonomus.core.config.FormSubscriptionOptions;
import com.tonomus.core.utils.LangUtils;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FormsCollectorRequestBuilderTest {

  private static final String KEY1 = "key1";

  private static final String VALUE1 = "value1";

  private static final String KEY2 = "key2";

  private static final String VALUE2 = "value2";

  private static final int INITIAL_DATA_SIZE = 3;

  @Mock
  private FormRequestParameterMap formRequestParameterMap;

  @Mock
  private FormRequest formRequest;

  @Mock
  private Resource resource;

  @BeforeEach
  void setUp() {
    when(formRequest.getParameterMap()).thenReturn(formRequestParameterMap);
  }

  @Test
  void testBuild_whenEmptyParameters() {
    when(formRequest.getParameterMap()).thenReturn(formRequestParameterMap);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertEquals(INITIAL_DATA_SIZE, data.size());
    assertNull(data.get(FormRequestParameterMap.PARAM_FORM_ID));
    assertEquals(StringUtils.EMPTY, data.get(FormsCollectorRequestBuilder.API_KEY));
    assertEquals(FormsCollectorRequestBuilder.OXAGON_DEFAULT_PREF_LANG,
        data.get(FormsCollectorRequestBuilder.PARAM_OXAGON_LANGUAGE));
  }

  @Test
  void testBuild_whenParameterMapIsSet() {
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(KEY1,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    requestParameters.put(KEY2,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE2))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertEquals(INITIAL_DATA_SIZE + requestParameters.size(), data.size());
    assertEquals(VALUE1, data.get(KEY1));
    assertEquals(VALUE2, data.get(KEY2));
  }

  @Test
  void testBuild_whenCookiesAreSet() {
    when(formRequest.getCookieValue(FormsCollectorRequestBuilder.COOKIE_GA))
        .thenReturn(Optional.of(VALUE1));
    when(formRequest.getCookieValue(FormsCollectorRequestBuilder.COOKIE_ECID))
        .thenReturn(Optional.of(VALUE2));
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertEquals(INITIAL_DATA_SIZE + 2, data.size());
    assertEquals(VALUE1, data.get(FormsCollectorRequestBuilder.COOKIE_GA));
    assertEquals(VALUE2, data.get(FormsCollectorRequestBuilder.COOKIE_ECID));
  }

  @Test
  void testBuild_whenInterestWasSetAndNoConfig() {
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.PARAM_OXAGON_INTEREST,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertFalse(data.containsKey(FormsCollectorRequestBuilder.PARAM_MC_LIST_ID));
  }

  @Test
  void testBuild_whenInterestAndStarSymbolConfigAreSet() {
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.PARAM_OXAGON_INTEREST,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    when(formRequestParameterMap.getFormId()).thenReturn(KEY1);

    FormAudienceOptions audienceOptions = mock(FormAudienceOptions.class);
    when(resource.adaptTo(FormAudienceOptions.class)).thenReturn(audienceOptions);
    MultiKeyMap<String, String> multiKeyMap = mock(MultiKeyMap.class);
    when(multiKeyMap.get(LangUtils.ENGLISH_LANGUAGE, VALUE1)).thenReturn(null);
    when(multiKeyMap.get(LangUtils.ENGLISH_LANGUAGE, "*")).thenReturn(VALUE2);
    when(audienceOptions.getAudienceOptions(KEY1)).thenReturn(multiKeyMap);

    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertTrue(data.containsKey(FormsCollectorRequestBuilder.PARAM_MC_LIST_ID));
    assertEquals(VALUE2, data.get(FormsCollectorRequestBuilder.PARAM_MC_LIST_ID));
  }

  @Test
  void testBuild_whenNoInterestAndStarSymbolConfigAreSet() {
    when(formRequestParameterMap.getFormId()).thenReturn(KEY1);
    FormAudienceOptions audienceOptions = mock(FormAudienceOptions.class);
    when(resource.adaptTo(FormAudienceOptions.class)).thenReturn(audienceOptions);
    MultiKeyMap<String, String> multiKeyMap = mock(MultiKeyMap.class);
    when(multiKeyMap.get(LangUtils.ENGLISH_LANGUAGE, "")).thenReturn(null);
    when(multiKeyMap.get(LangUtils.ENGLISH_LANGUAGE, "*")).thenReturn(VALUE2);
    when(audienceOptions.getAudienceOptions(KEY1)).thenReturn(multiKeyMap);

    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertTrue(data.containsKey(FormsCollectorRequestBuilder.PARAM_MC_LIST_ID));
    assertEquals(VALUE2, data.get(FormsCollectorRequestBuilder.PARAM_MC_LIST_ID));
  }

  @Test
  void testBuild_whenInterestAndConfigAreSet() {
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.PARAM_OXAGON_INTEREST,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    when(formRequestParameterMap.getFormId()).thenReturn(KEY1);
    FormAudienceOptions audienceOptions = mock(FormAudienceOptions.class);
    when(resource.adaptTo(FormAudienceOptions.class)).thenReturn(audienceOptions);
    MultiKeyMap<String, String> multiKeyMap = mock(MultiKeyMap.class);
    when(multiKeyMap.get(LangUtils.ENGLISH_LANGUAGE, VALUE1)).thenReturn(VALUE2);
    when(audienceOptions.getAudienceOptions(KEY1)).thenReturn(multiKeyMap);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertTrue(data.containsKey(FormsCollectorRequestBuilder.PARAM_MC_LIST_ID));
    assertEquals(VALUE2, data.get(FormsCollectorRequestBuilder.PARAM_MC_LIST_ID));
  }

  @Test
  void testBuild_whenSubscriptionWasSetAndNoConfig() {
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.CONTACT_PERMISSIONS,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertFalse(data.containsKey(FormsCollectorRequestBuilder.PARAM_MC_LIST_STATUS));
  }

  @Test
  void testBuild_whenSubscriptionWasSetAndConfigDoesNotMatch() {
    FormAudienceOptions audienceOptions = mock(FormAudienceOptions.class);
    when(resource.adaptTo(FormAudienceOptions.class)).thenReturn(audienceOptions);
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.CONTACT_PERMISSIONS,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    FormSubscriptionOptions subscriptionOptions = mock(FormSubscriptionOptions.class);
    when(resource.adaptTo(FormSubscriptionOptions.class)).thenReturn(subscriptionOptions);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertFalse(data.containsKey(FormsCollectorRequestBuilder.PARAM_MC_LIST_STATUS));
  }

  @Test
  void testBuild_whenSubscriptionWasSetAndConfigSet() {
    FormAudienceOptions audienceOptions = mock(FormAudienceOptions.class);
    when(resource.adaptTo(FormAudienceOptions.class)).thenReturn(audienceOptions);
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.CONTACT_PERMISSIONS,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    FormSubscriptionOptions subscriptionOptions = mock(FormSubscriptionOptions.class);
    when(resource.adaptTo(FormSubscriptionOptions.class)).thenReturn(subscriptionOptions);
    when(subscriptionOptions.getStatus(VALUE1)).thenReturn(VALUE2);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertTrue(data.containsKey(FormsCollectorRequestBuilder.PARAM_MC_LIST_STATUS));
    assertEquals(VALUE2, data.get(FormsCollectorRequestBuilder.PARAM_MC_LIST_STATUS));
  }

  @Test
  void testBuild_whenCountrySet() {
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.COUNTRY,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertEquals(VALUE1, data.get(FormsCollectorRequestBuilder.COUNTRY_PHONE));
  }

  @Test
  void testBuild_whenPhoneSet() {
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.PHONE,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE2))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertEquals(VALUE2, data.get(FormsCollectorRequestBuilder.COUNTRY_PHONE));
  }

  @Test
  void testBuild_whenCountryAndPhoneSet() {
    Map<String, FormRequestParameterValue> requestParameters = new HashMap<>();
    requestParameters.put(FormsCollectorRequestBuilder.COUNTRY,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE1))));
    requestParameters.put(FormsCollectorRequestBuilder.PHONE,
        new FormRequestParameterValue(ArrayUtils.toArray(new MockRequestParameter(VALUE2))));
    when(formRequestParameterMap.getParameters()).thenReturn(requestParameters);
    FormsCollectorRequestBuilder underTest = new FormsCollectorRequestBuilder(formRequest,
        resource, StringUtils.EMPTY);
    Map<String, Object> data = underTest.build();
    assertEquals(VALUE1 + VALUE2, data.get(FormsCollectorRequestBuilder.COUNTRY_PHONE));
  }

}