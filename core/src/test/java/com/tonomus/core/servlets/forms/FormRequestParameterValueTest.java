package com.tonomus.core.servlets.forms;

import java.util.Arrays;
import java.util.List;

import org.apache.sling.api.request.RequestParameter;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FormRequestParameterValueTest {

    private static final String FIRST_VALUE = "first-value";

    private static final String SECOND_VALUE = "second-value";

    @Test
    void testConstructor_whenNull() {
        FormRequestParameterValue underTest = new FormRequestParameterValue(null);
        assertNotNull(underTest);
        assertTrue(underTest.isEmpty());
    }

    @Test
    void testConstructor_whenEmptyArray() {
        FormRequestParameterValue underTest = new FormRequestParameterValue(new MockRequestParameter[] {});
        assertNotNull(underTest);
        assertTrue(underTest.isEmpty());
    }

    @Test
    void testConstructor_whenSingleElement() {
        RequestParameter parameter = new MockRequestParameter(FIRST_VALUE);
        RequestParameter[] parameters = new RequestParameter[] {parameter};
        FormRequestParameterValue underTest = new FormRequestParameterValue(parameters);
        assertNotNull(underTest);
        assertEquals(FIRST_VALUE, underTest.getValue());
    }

    @Test
    void testConstructor_whenMultipleElements() {
        RequestParameter parameter1 = new MockRequestParameter(FIRST_VALUE);
        RequestParameter parameter2 = new MockRequestParameter(SECOND_VALUE);
        RequestParameter[] parameters = new RequestParameter[] {parameter1, parameter2};
        FormRequestParameterValue underTest = new FormRequestParameterValue(parameters);
        assertNotNull(underTest);
        assertIterableEquals(Arrays.asList(FIRST_VALUE, SECOND_VALUE), (List<String>) underTest.getValue());
    }

}