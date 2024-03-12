package com.tonomus.core.slingmodels.components.v1.contentslider;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class ContentSliderItemModelTest {

  private static final String CONTENT_PATH = "/content/tonomus/en-us/c77_slider";

  @Test @DisplayName("Test all getters and setters of package")
  void getterSetterPackageTest() {
    assertPojoMethodsForAll(ContentSliderModel.class, ContentSliderItemModel.class,
        MultipleCopyModel.class, MultipleCopyModel.CopyModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER)
        .areWellImplemented();
  }

  @Test void testFormField(AemContext aemContext) {
    aemContext.load()
        .json("/components/c77-content-slider/c77-content-slider.json", CONTENT_PATH);

    String RESOURCE_PATH = CONTENT_PATH;
    ContentSliderModel contentSliderModel =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(ContentSliderModel.class);
    assertNotNull(contentSliderModel);

    RESOURCE_PATH = CONTENT_PATH + "/c77_slider_item_1";
    ContentSliderItemModel item = aemContext.currentResource(RESOURCE_PATH).adaptTo(ContentSliderItemModel.class);
    assertNotNull(item);
    assertNull(item.getMultipleCopy());
  }
}
