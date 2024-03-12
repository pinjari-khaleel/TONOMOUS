package com.tonomus.core.services.impl.v2;

import uk.org.lidalia.slf4jext.Level;
import uk.org.lidalia.slf4jtest.LoggingEvent;
import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

import com.tonomus.core.services.impl.v2.TonomusRecaptchaValidationServiceImpl.GoogleRecaptchaResponse;
import com.tonomus.core.services.v2.TonomusRecaptchaConfigService;

import junitx.util.PrivateAccessor;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

class TonomusRecaptchaValidationServiceImplTest {

  private TonomusRecaptchaValidationServiceImpl service;

  private TestLogger log = TestLoggerFactory.getTestLogger(TonomusRecaptchaValidationServiceImpl.class);

  @BeforeEach
  void setUp() {
    service = new TonomusRecaptchaValidationServiceImpl();
  }

  @Test
  void testValidateEmptyReCaptcha() {
    assertFalse(service.validate(""));
    List<LoggingEvent> loggingEvents = log.getLoggingEvents();
    assertEquals(1, loggingEvents.size());
    assertEquals(Level.ERROR, loggingEvents.get(0).getLevel());
    assertEquals("ERROR_TONOMUS(V2)_002: Recaptcha token is missing.", loggingEvents.get(0).getMessage());
  }

  @Test
  void testValidateWithReCaptcha() throws NoSuchFieldException {
    TonomusRecaptchaConfigService tonomusRecaptchaConfigService = mock(TonomusRecaptchaConfigService.class);
    EndpointResponse endpointResponse = mock(EndpointResponse.class);
    GoogleRecaptchaResponse googleRecaptchaResponse = mock(GoogleRecaptchaResponse.class);
    PrivateAccessor.setField(service, "tonomusRecaptchaConfigService",
        tonomusRecaptchaConfigService);
    PrivateAccessor.setField(googleRecaptchaResponse, "success", true);

    MockitoAnnotations.initMocks(service);
    TonomusRecaptchaValidationServiceImpl spy = spy(service);

    when(tonomusRecaptchaConfigService.getSiteVerifyURL()).thenReturn("https://test.com");
    when(tonomusRecaptchaConfigService.getSecretKey()).thenReturn("thisisasecretkey");
    doReturn(endpointResponse).when(spy).executeRequest(any(), any());
    when((GoogleRecaptchaResponse) endpointResponse.getData()).thenReturn(googleRecaptchaResponse);

    assertNull(spy.getHttpClientBuilderFactory());
    assertTrue(spy.validate("test"));
  }
}