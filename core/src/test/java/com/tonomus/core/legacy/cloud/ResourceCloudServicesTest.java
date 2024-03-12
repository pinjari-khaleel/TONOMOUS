package com.tonomus.core.legacy.cloud;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import com.day.cq.wcm.webservicesupport.Configuration;
import com.day.cq.wcm.webservicesupport.ConfigurationManager;

import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ResourceCloudServicesTest {

  private static final String CONTENT_PATH = "/content/tonomus";

  private static final String[] ALL_SERVICES = new String[] {
      "/etc/cloudservices/form-collector/configuration",
      "/etc/cloudservices/google-recaptcha/configuration"
  };

  public static final String MAIN_PAGE_PATH = PathUtils.concat(CONTENT_PATH, "en-us");

  @Mock
  private ConfigurationManager configurationManager;

  @Mock
  private Configuration configuration;

  @Mock
  private Resource configurationResource;

  private Resource mainPageResource;

  @BeforeEach void setUp(AemContext aemContext) {
    aemContext.load().json("/legacy/cloud/resource.json", CONTENT_PATH);
    mainPageResource = aemContext.resourceResolver().getResource(MAIN_PAGE_PATH);
  }

  private void registerConfigurationManager(final AemContext aemContext) {
    aemContext.registerAdapter(ResourceResolver.class,
        ConfigurationManager.class, configurationManager);
  }

  private void registerConfiguration(final AemContext aemContext) {
    when(configurationManager.getConfiguration(
        CloudServiceConfiguration.GOOGLE_RECAPTCHA.getCode(), ALL_SERVICES))
        .thenReturn(configuration);
    when(configuration.getContentResource()).thenReturn(configurationResource);
  }

  @Test
  void testConstructorInitialization_whenContextConfigured(AemContext aemContext) {
    registerConfigurationManager(aemContext);
    assertNotNull(new ResourceCloudServices(mainPageResource));
  }

  @Test
  void testGetConfiguration_whenConfigurationDoesNotExist(AemContext aemContext) {
    registerConfigurationManager(aemContext);
    ResourceCloudServices cloudServices = new ResourceCloudServices(mainPageResource);
    assertThrows(IllegalArgumentException.class,
        () -> cloudServices.getConfiguration(CloudServiceConfiguration.GOOGLE_RECAPTCHA));
  }

  @Test
  void testGetConfiguration_whenConfigurationExists(AemContext aemContext) {
    registerConfigurationManager(aemContext);
    registerConfiguration(aemContext);
    ResourceCloudServices cloudServices = new ResourceCloudServices(mainPageResource);
    cloudServices.getConfiguration(CloudServiceConfiguration.GOOGLE_RECAPTCHA);
    verify(configurationResource, times(1))
        .adaptTo(CloudServiceConfiguration.GOOGLE_RECAPTCHA.getModelClass());
  }

}