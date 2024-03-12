package com.tonomus.core.services.impl;

import uk.org.lidalia.slf4jext.Level;
import uk.org.lidalia.slf4jtest.LoggingEvent;
import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

import com.tonomus.core.services.impl.GoogleRecaptchaValidationServiceImpl.GoogleRecaptchaResponse;

import junitx.util.PrivateAccessor;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

class GoogleRecaptchaValidationServiceImplTest {
  GoogleRecaptchaValidationServiceImpl service;
  TestLogger log = TestLoggerFactory.getTestLogger(GoogleRecaptchaValidationServiceImpl.class);

  @BeforeEach
  void setUp() {
    service = new GoogleRecaptchaValidationServiceImpl();
  }

  @Test
  void testValidateEmptyReCaptcha() {
    assertFalse(service.validate("", ""));
    List<LoggingEvent> loggingEvents = log.getLoggingEvents();
    assertEquals(1, loggingEvents.size());
    assertEquals(Level.ERROR, loggingEvents.get(0).getLevel());
    assertEquals("Unable to validate: reCaptcha or currentPagePath are null", loggingEvents.get(0).getMessage());

    assertFalse(service.validate("", "test"));
    assertFalse(service.validate("test", "test"));
  }

  @Test
  void testValidateWithReCaptcha() throws NoSuchFieldException {
    EndpointResponse endpointResponse = mock(EndpointResponse.class);
    GoogleRecaptchaResponse googleRecaptchaResponse = mock(GoogleRecaptchaResponse.class);
    PrivateAccessor.setField(googleRecaptchaResponse, "success", true);
    MockitoAnnotations.initMocks(service);
    GoogleRecaptchaValidationServiceImpl spy = spy(service);

    doReturn(endpointResponse).when(spy).executeRequest(any(), any());
    when((GoogleRecaptchaResponse) endpointResponse.getData()).thenReturn(googleRecaptchaResponse);

    assertNull(spy.getHttpClientBuilderFactory());
    assertTrue(spy.validate("test", "test"));
  }
}