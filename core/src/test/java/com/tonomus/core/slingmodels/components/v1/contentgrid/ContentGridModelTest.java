package com.tonomus.core.slingmodels.components.v1.contentgrid;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class ContentGridModelTest {

  private static final String CONTENT_PATH = "/content/tonomus/en-us/mebrand";

  @BeforeEach
  public void setUp(AemContext context) {
    context.load().json("/components/c24-content/c24-content.json", CONTENT_PATH);
  }

  @Test
  void test(AemContext aemContext) {
    // test getters
    assertPojoMethodsForAll(ContentGridModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();

    String RESOURCE_PATH = "/content/tonomus/en-us/mebrand"
        + "/jcr:content/root/responsivegrid/c24_content";

    ContentGridModel model1 = getContentGridModel(aemContext, RESOURCE_PATH + "_1");
    assertFalse(model1.getItemsCount() < model1.getMaxAllowedItemsCount());
    ContentGridModel model2 = getContentGridModel(aemContext, RESOURCE_PATH + "_2");
    assertFalse(model2.getItemsCount() < model2.getMaxAllowedItemsCount());
    assertNull(model2.getBackground());
    ContentGridModel model3 = getContentGridModel(aemContext, RESOURCE_PATH + "_3");
    assertTrue(model3.getItemsCount() < model3.getMaxAllowedItemsCount());
    ContentGridModel model4 = getContentGridModel(aemContext, RESOURCE_PATH + "_4");
    assertTrue(model4.getItemsCount() < model4.getMaxAllowedItemsCount());
    ContentGridModel model5 = getContentGridModel(aemContext, RESOURCE_PATH + "_fullWidth");
    assertEquals(1, model5.getMaxAllowedItemsCount());
  }

  ContentGridModel getContentGridModel(AemContext aemContext, String path) {
    Resource resource = aemContext.currentResource(path);
    assertNotNull(resource);
    ContentGridModel contentGridModel = resource.adaptTo(ContentGridModel.class);
    assertNotNull(contentGridModel);
    return contentGridModel;
  }
}
