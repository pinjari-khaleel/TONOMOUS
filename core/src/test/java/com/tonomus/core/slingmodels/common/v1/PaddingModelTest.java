package com.tonomus.core.slingmodels.common.v1;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class PaddingModelTest {
  private static final String CONTENT_PATH = "/content/tonomus/language-masters/en/mebrand";
  private static final String RESOURCE_PATH = "/content/tonomus/language-masters/en/mebrand"
      + "/jcr:content/root/responsivegrid/c24_content";
  @BeforeEach
  public void setUp(AemContext context) {
    context.load().json("/components/c24-content/c24-content.json", CONTENT_PATH);
  }

  @Test
  @DisplayName("Test all getters")
  void getterAttributeCreatorModelTest() {
    assertPojoMethodsForAll(PaddingModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @Test
  void test(AemContext aemContext) {
    CommonComponentModel componentModel = getPaddingModel(aemContext, RESOURCE_PATH + "_default_padding");
    assertNotNull(componentModel);
    assertNull(componentModel.getPadding());
    CommonComponentModel componentModelLarge = getPaddingModel(aemContext, RESOURCE_PATH + "_large_padding");
    assertNotNull(componentModelLarge);
    assertEquals("--component-block-padding: var(--block-padding-large);",
        componentModelLarge.getPadding().getStyleInline());
    CommonComponentModel componentModelNone = getPaddingModel(aemContext, RESOURCE_PATH + "_none_padding");
    assertNotNull(componentModelNone);
    assertEquals("--component-block-padding: var(--block-padding-none);",
        componentModelNone.getPadding().getStyleInline());
  }

  CommonComponentModel getPaddingModel(AemContext aemContext, String path) {
    Resource resource = aemContext.currentResource(path);
    assertNotNull(resource);
    CommonComponentModel componentModel = resource.adaptTo(CommonComponentModel.class);
    assertNotNull(componentModel);
    return componentModel;
  }
}