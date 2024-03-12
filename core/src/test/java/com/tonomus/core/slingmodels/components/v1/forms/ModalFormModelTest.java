package com.tonomus.core.slingmodels.components.v1.forms;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.day.cq.wcm.webservicesupport.Configuration;
import com.day.cq.wcm.webservicesupport.ConfigurationManager;
import com.tonomus.core.legacy.cloud.CloudServiceConfiguration;
import com.tonomus.core.legacy.cloud.GoogleRecaptchaConfiguration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class ModalFormModelTest {

  private static final String CONTENT_PATH = "/content/tonomus/en-us/c92-test";

  @BeforeEach
  public void setUp(AemContext context) {
    context.load().json("/components/c92-modal/c92-modal-page.json", CONTENT_PATH);
  }

  @Test
  void testModelThrowIllegal(AemContext aemContext) {
    ConfigurationManager configurationManager = mock(ConfigurationManager.class);
    aemContext.registerAdapter(ResourceResolver.class,
        ConfigurationManager.class,configurationManager);   
    ModalFormModel model = aemContext.resourceResolver().getResource(CONTENT_PATH).adaptTo(ModalFormModel.class);
    assertNotNull(model);    
  }

  @Test
  void testModel(AemContext aemContext) {
    String RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid/c92_modal";

    Resource configResource = mock(Resource.class);
    ConfigurationManager configurationManager = mock(ConfigurationManager.class);
    Configuration configuration = mock(Configuration.class);
    GoogleRecaptchaConfiguration googleRecaptchaConfiguration = mock(GoogleRecaptchaConfiguration.class);
    String[] ALL_SERVICES = new String[] {
        "/etc/cloudservices/form-collector/configuration",
        "/etc/cloudservices/google-recaptcha/configuration"
    };

    aemContext.registerAdapter(ResourceResolver.class,
        ConfigurationManager.class, configurationManager);

    when(configurationManager.getConfiguration(
        CloudServiceConfiguration.GOOGLE_RECAPTCHA.getCode(), ALL_SERVICES))
        .thenReturn(configuration);
    when(configuration.getContentResource()).thenReturn(configResource);
    when(configResource.adaptTo(GoogleRecaptchaConfiguration.class)).thenReturn(
        googleRecaptchaConfiguration);

    ModalFormModel model = aemContext.resourceResolver().getResource(RESOURCE_PATH).adaptTo(ModalFormModel.class);
    assertNotNull(model);
    assertEquals(1, model.getGroups().size());
    assertNotNull(model.toJson());
  }

  @Test
  @DisplayName("Test all getters of ModalFormModel")
  void getterMethodsTest() {
    assertPojoMethodsForAll(ModalFormModel.class).testing(Method.CONSTRUCTOR, Method.GETTER)
        .areWellImplemented();
  }
}
