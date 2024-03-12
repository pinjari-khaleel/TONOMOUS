package com.tonomus.core.slingmodels.common.v1;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import org.apache.sling.api.SlingConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(AemContextExtension.class)
class ConfigResourceModelTest {

  private static final String CONTENT_PATH = "/content/tonomus/page";

  private static final String RESOURCE_TYPE =
      "tonomus/components/content/components/s02-footer/v1/s02-footer";

  @BeforeEach void setUp(AemContext aemContext) {
    aemContext.load().json("/common/config-resource.json", CONTENT_PATH);
  }

  @Test void testValidPagePath(AemContext aemContext) {
    aemContext.currentResource(CONTENT_PATH);

    aemContext.request().setAttribute(SlingConstants.PROPERTY_RESOURCE_TYPE, RESOURCE_TYPE);
    aemContext.request().setAttribute("configPage", "conf/admin");
    aemContext.request().setAttribute("isRelativePath", true);

    ConfigResourceModel configModel = aemContext.request().adaptTo(ConfigResourceModel.class);
    assertEquals("/content/tonomus/page/conf/admin/jcr:content/root/responsivegrid/s02_footer",
        configModel.getResourcePath());
  }

  @Test void testNoResourceAvailable(AemContext aemContext) {
    aemContext.currentResource(CONTENT_PATH);

    aemContext.request().setAttribute(SlingConstants.PROPERTY_RESOURCE_TYPE, "my-resource");
    aemContext.request().setAttribute("configPage", "conf/admin");
    aemContext.request().setAttribute("isRelativePath", true);

    ConfigResourceModel configModel = aemContext.request().adaptTo(ConfigResourceModel.class);
    assertEquals("", configModel.getResourcePath());
  }

  @Test void testInValidPagePath(AemContext aemContext) {
    aemContext.currentResource(CONTENT_PATH);

    aemContext.request().setAttribute(SlingConstants.PROPERTY_RESOURCE_TYPE, RESOURCE_TYPE);
    aemContext.request().setAttribute("configPage", "conf/no-page");
    aemContext.request().setAttribute("isRelativePath", true);

    ConfigResourceModel configModel = aemContext.request().adaptTo(ConfigResourceModel.class);
    assertEquals("", configModel.getResourcePath());
  }

  @Test void testNoParametersPath(AemContext aemContext) {
    aemContext.currentResource(CONTENT_PATH);

    ConfigResourceModel configModel = aemContext.request().adaptTo(ConfigResourceModel.class);
    assertEquals("", configModel.getResourcePath());
  }


}
