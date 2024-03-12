package com.tonomus.core.servlets.forms.v2.helper;

import java.util.Map;
import java.util.Optional;

import javax.servlet.http.Cookie;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.xss.XSSAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.tonomus.core.servlets.forms.FormRequestParameterMap.PARAM_FORM_ID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FormRequestTest {

    private static final String COOKIE_NAME = "oreo";

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private XSSAPI xssapi;

    @BeforeEach
    void setUp() {
        RequestParameter[] parameter = new RequestParameter[] {new MockRequestParameter(PARAM_FORM_ID)};
        Map<String, RequestParameter[]> inputMap = Map.of(PARAM_FORM_ID, parameter, StringUtils.EMPTY, parameter);
        when(request.getRequestParameterMap()).thenReturn(new MockRequestParameterMap(inputMap));
    }

    @Test
    void testConstructorInitialization() {
        FormRequest underTest = new FormRequest(request, xssapi);
        assertNotNull(underTest);
        assertNotNull(underTest.getParameterMap());
    }

    @Test
    void testGetCookieValue_whenCookieDoesNotExist() {
        FormRequest underTest = new FormRequest(request, xssapi);
        assertEquals(Optional.empty(), underTest.getCookieValue(COOKIE_NAME));
    }

    @Test
    void testGetCookieValue_whenCookieExists() {
        when(request.getCookie(COOKIE_NAME)).thenReturn(new Cookie(COOKIE_NAME, COOKIE_NAME));
        FormRequest underTest = new FormRequest(request, xssapi);
        assertEquals(Optional.of(COOKIE_NAME), underTest.getCookieValue(COOKIE_NAME));
    }

}