package com.tonomus.core.servlets.forms.v2.helper;

import java.util.Arrays;
import java.util.List;

import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.xss.XSSAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FormRequestParameterValueTest {

    private static final String FIRST_VALUE = "first-value";

    private static final String SECOND_VALUE = "second-value";

    private XSSAPI xssapi;

      @BeforeEach
  void setUp() {
    xssapi = mock(XSSAPI.class);
    when(xssapi.encodeForHTML(anyString())).then(val -> val.getArgument(0));
  }

    @Test
    void testConstructor_whenNull() {
        FormRequestParameterValue underTest = new FormRequestParameterValue(null, xssapi);
        assertNotNull(underTest);
        assertTrue(underTest.isEmpty());
    }

    @Test
    void testConstructor_whenEmptyArray() {
        FormRequestParameterValue underTest = new FormRequestParameterValue(new MockRequestParameter[] {}, xssapi);
        assertNotNull(underTest);
        assertTrue(underTest.isEmpty());
    }

    @Test
    void testConstructor_whenSingleElement() {
        RequestParameter parameter = new MockRequestParameter(FIRST_VALUE);
        RequestParameter[] parameters = new RequestParameter[] {parameter};
        FormRequestParameterValue underTest = new FormRequestParameterValue(parameters, xssapi);
        assertNotNull(underTest);
        assertEquals(FIRST_VALUE, underTest.getValue());
    }

    @Test
    void testConstructor_whenMultipleElements() {
        RequestParameter parameter1 = new MockRequestParameter(FIRST_VALUE);
        RequestParameter parameter2 = new MockRequestParameter(SECOND_VALUE);
        RequestParameter[] parameters = new RequestParameter[] {parameter1, parameter2};
        FormRequestParameterValue underTest = new FormRequestParameterValue(parameters, xssapi);
        assertNotNull(underTest);
        assertIterableEquals(Arrays.asList(FIRST_VALUE, SECOND_VALUE), (List<String>) underTest.getValue());
    }

}