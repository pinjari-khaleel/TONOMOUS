package com.tonomus.core.servlets.forms.v2;

import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

import java.io.IOException;

import com.tonomus.core.services.impl.v2.EndpointResponse;
import com.tonomus.core.services.v2.TonomusRecaptchaValidationService;
import com.tonomus.core.services.v2.FormFactoryConfigService;
import com.tonomus.core.services.v2.FormMandatoryFieldValidationService;
import com.tonomus.core.services.v2.TonomusFormCollectorConfigService;
import com.tonomus.core.services.v2.TonomusFormCollectorService;
import com.tonomus.core.servlets.forms.TestUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import junitx.util.PrivateAccessor;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.apache.sling.xss.XSSAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.tonomus.core.constants.Constants.PARAM_G_RECAPTCHA_RESPONSE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FormServletTest {

  private final TestLogger testLogger =
      TestLoggerFactory.getTestLogger(FormServlet.class);

  private FormServlet formServlet;

  private TonomusRecaptchaValidationService tonomusRecaptchaValidationService;

  private FormMandatoryFieldValidationService formMandatoryFieldValidationService;

  private FormFactoryConfigService formFactoryConfigService;

  private TonomusFormCollectorConfigService tonomusFormCollectorConfigService;

  private TonomusFormCollectorService tonomusFormCollectorService;

  private XSSAPI xssapi;

  @BeforeEach
  void setUp(AemContext context) throws IOException, NoSuchFieldException {
    context = new AemContext();
    formServlet = new FormServlet();
    tonomusRecaptchaValidationService = mock(TonomusRecaptchaValidationService.class);
    formMandatoryFieldValidationService = mock(FormMandatoryFieldValidationService.class);
    formFactoryConfigService = mock(FormFactoryConfigService.class);
    tonomusFormCollectorConfigService = mock(TonomusFormCollectorConfigService.class);
    tonomusFormCollectorService = mock(TonomusFormCollectorService.class);
    xssapi = mock(XSSAPI.class);

    context.registerService(tonomusFormCollectorConfigService);
    context.registerService(formMandatoryFieldValidationService);
    context.registerService(formFactoryConfigService);
    context.registerService(tonomusFormCollectorConfigService);
    context.registerService(tonomusFormCollectorService);
    context.registerService(xssapi);

    PrivateAccessor.setField(formServlet, "tonomusRecaptchaValidationService", tonomusRecaptchaValidationService);
    PrivateAccessor.setField(formServlet, "formFactoryConfigService", formFactoryConfigService);
    PrivateAccessor.setField(formServlet, "tonomusFormCollectorConfigService", tonomusFormCollectorConfigService);
    PrivateAccessor.setField(formServlet, "formMandatoryFieldValidationService", formMandatoryFieldValidationService);
    PrivateAccessor.setField(formServlet, "tonomusFormCollectorService", tonomusFormCollectorService);
    PrivateAccessor.setField(formServlet, "xssapi", xssapi);
  }

  @Test
  void testDoPost_ThrowException(AemContext context) throws IOException {
    formServlet.doPost(context.request(), context.response());
    assertEquals("ERROR_TONOMUS(V2)_003: Exception occurred while processing POST request", TestUtils.getLastLogEvent(testLogger).getMessage());
  }

  @Test
  void testDoPost_ValidRequest(AemContext context) throws IOException {
    MockSlingHttpServletRequest request = context.request();
    request.addRequestParameter("form_id", "a_form");
    request.addRequestParameter(PARAM_G_RECAPTCHA_RESPONSE, "token");
    MockSlingHttpServletResponse response = context.response();

    when(tonomusRecaptchaValidationService.validate("token")).thenReturn(true);
    when(tonomusFormCollectorConfigService.getSiteKey()).thenReturn("sitekey");
    doReturn(formFactoryConfigService).when(formFactoryConfigService).getConfig(anyString());
    
    MultiKeyMap<String, String> audiencesMap = mock(MultiKeyMap.class);
    when(formFactoryConfigService.getAudienceIds()).thenReturn(audiencesMap);

    doNothing().when(formMandatoryFieldValidationService).validate(any());
    EndpointResponse<String> collectorResponse = mock(EndpointResponse.class);
    doReturn(collectorResponse).when(tonomusFormCollectorService).sendFormData(any());
    when(collectorResponse.getData()).thenReturn("this is pass");
    
    formServlet.doPost(request, response);
    assertNotNull(collectorResponse);
    assertNotNull(response);
  }

  @Test
  void testDoPost_ThrowExceptionInProcessRequest(AemContext context) throws IOException {
    MockSlingHttpServletRequest request = context.request();
    request.addRequestParameter("form_id", "a_form");
    request.addRequestParameter(PARAM_G_RECAPTCHA_RESPONSE, "token");
    MockSlingHttpServletResponse response = context.response();

    when(tonomusRecaptchaValidationService.validate("token")).thenReturn(true);
    when(tonomusFormCollectorConfigService.getSiteKey()).thenReturn("sitekey");
    doReturn(formFactoryConfigService).when(formFactoryConfigService).getConfig(anyString());
    
    MultiKeyMap<String, String> audiencesMap = mock(MultiKeyMap.class);
    when(formFactoryConfigService.getAudienceIds()).thenReturn(audiencesMap);

    doNothing().when(formMandatoryFieldValidationService).validate(any());
    EndpointResponse<String> collectorResponse = mock(EndpointResponse.class);
    doReturn(collectorResponse).when(tonomusFormCollectorService).sendFormData(any());
    when(collectorResponse.getData()).thenReturn("");
    when(collectorResponse.getResponseCode()).thenReturn(500);
    formServlet.doPost(request, response);
    assertNotNull(collectorResponse);
    assertNotNull(response);
  }

}