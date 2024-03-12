package com.tonomus.core.servlets.forms;

import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

import java.io.IOException;
import java.io.PrintWriter;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.webservicesupport.Configuration;
import com.day.cq.wcm.webservicesupport.ConfigurationManager;
import com.tonomus.core.legacy.cloud.GoogleRecaptchaConfiguration;
import com.tonomus.core.services.CaptchaValidationService;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class GenericFormsServletTest {

  private final TestLogger testLogger =
      TestLoggerFactory.getTestLogger(GenericFormsServlet.class);
  @InjectMocks
  private GenericFormsServlet genericFormsServlet;

  @Mock
  private CaptchaValidationService captchaValidationService;

  @Mock
  private GoogleRecaptchaConfiguration googleRecaptchaConfiguration;

  @Mock
  private SlingHttpServletRequest request;
  @Mock
  private SlingHttpServletResponse response;
  @Mock
  private Resource resource;
  @Mock
  private ResourceResolver resolver;
  @Mock
  private PageManager pageManager;
  @Mock
  private Page page;
  @Mock
  private ConfigurationManager configurationManager;
  @Mock
  private Configuration configuration;
  @Mock
  private Resource confResource;
  @Mock
  private PrintWriter printWriter;

  @BeforeEach
  public void setUp() throws IOException {
    when(response.getWriter()).thenReturn(printWriter);
    when(request.getResource()).thenReturn(resource);
    when(resource.getResourceResolver()).thenReturn(resolver);
    when(resolver.adaptTo(PageManager.class)).thenReturn(pageManager);
    when(resolver.adaptTo(ConfigurationManager.class)).thenReturn(configurationManager);
    when(pageManager.getContainingPage(resource)).thenReturn(page);
    when(configurationManager.getConfiguration(any(), any())).thenReturn(configuration);
    when(configuration.getContentResource()).thenReturn(confResource);
    when(confResource.adaptTo(GoogleRecaptchaConfiguration.class)).thenReturn(
        googleRecaptchaConfiguration);
  }

  @Test
  public void testDoPost_ValidRequest() throws IOException {
    when(googleRecaptchaConfiguration.getReCaptchaSecretKey()).thenReturn("secret_key");
    doReturn(false).when(captchaValidationService).validate("secret_key", null);
    genericFormsServlet.doPost(request, response);
    assertEquals("Error during request: ", TestUtils.getLastLogEvent(testLogger).getMessage());
  }

}