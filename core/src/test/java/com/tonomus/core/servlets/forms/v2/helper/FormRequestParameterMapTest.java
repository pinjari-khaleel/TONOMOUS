package com.tonomus.core.servlets.forms.v2.helper;

import java.util.Collections;
import java.util.Map;

import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.xss.XSSAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static com.tonomus.core.constants.Constants.PARAM_G_RECAPTCHA_RESPONSE;
import static com.tonomus.core.servlets.forms.FormRequestParameterMap.PARAM_FORM_ID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FormRequestParameterMapTest {

    private static final String OXAGON_FORM_ID = "oxagon_form";

    private static final String P_COLON_PREFIXED = ":anyParameter";

    private static final String DUMMY_VALUE = "value";

    private RequestParameterMap initialParameters;

    private XSSAPI xssapi;

    @BeforeEach
    void setUp() {
        RequestParameter[] parameter = new RequestParameter[] {new MockRequestParameter(OXAGON_FORM_ID)};
        Map<String, RequestParameter[]> inputMap = Map.of(FormRequestParameterMap.PARAM_FORM_ID, parameter);
        initialParameters = new MockRequestParameterMap(inputMap);
        xssapi = mock(XSSAPI.class);
        when(xssapi.encodeForHTML(anyString())).then(val -> val.getArgument(0));
    }

    @Test
    void testConstructor_whenNoFormId() {
        RequestParameterMap parameterMap = new MockRequestParameterMap(Collections.emptyMap());
        assertThrows(IllegalArgumentException.class, () -> new FormRequestParameterMap(parameterMap, xssapi));
    }

    @Test
    void testConstructor_whenNoFormParameters() {
        assertThrows(IllegalArgumentException.class, () -> new FormRequestParameterMap(initialParameters, xssapi));
    }

    @Test
    void testGetParameters_whenRecaptchaResponse() {
        RequestParameter[] recaptchaResponse =
                new RequestParameter[] {new MockRequestParameter(PARAM_G_RECAPTCHA_RESPONSE)};
        initialParameters.put(PARAM_G_RECAPTCHA_RESPONSE, recaptchaResponse);
        FormRequestParameterMap underTest =  new FormRequestParameterMap(initialParameters, xssapi);
        assertTrue(underTest.getParameters().isEmpty());
    }

    @Test
    void testGetParameters_whenColon() {
        RequestParameter[] colonPrefixed = new RequestParameter[] {new MockRequestParameter(DUMMY_VALUE)};
        initialParameters.put(P_COLON_PREFIXED, colonPrefixed);
        FormRequestParameterMap underTest =  new FormRequestParameterMap(initialParameters, xssapi);
        assertTrue(underTest.getParameters().isEmpty());
    }

    @Test
    void testGetParameters_whenParameterExists() {
        MockRequestParameter mockRequestParameter = new MockRequestParameter(DUMMY_VALUE);
        RequestParameter[] parameter = new RequestParameter[] {mockRequestParameter};
        initialParameters.put(P_COLON_PREFIXED, parameter);
        parameter = new RequestParameter[] {new MockRequestParameter(PARAM_G_RECAPTCHA_RESPONSE)};
        initialParameters.put(PARAM_G_RECAPTCHA_RESPONSE, parameter);
        parameter = new RequestParameter[] {mockRequestParameter, mockRequestParameter};
        initialParameters.put(DUMMY_VALUE,  parameter);
        parameter = new RequestParameter[] {new MockRequestParameter(PARAM_FORM_ID)};
        initialParameters.put(PARAM_FORM_ID, parameter);
        FormRequestParameterMap underTest =  new FormRequestParameterMap(initialParameters, xssapi);
        assertNotNull(underTest.getFormId());
        assertEquals(1, underTest.getParameters().size());
        assertTrue(underTest.getParameters().containsKey(DUMMY_VALUE));
    }

}