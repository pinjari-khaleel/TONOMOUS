package com.tonomus.core.slingmodels.common.v1;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.utils.AppAemContextUtils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class PagePropertiesModelTest {

  private static final String CONTENT_PATH = "/content/tonomus";

  @Test
  @DisplayName("Test all getters of PagePropertiesModel")
  void getterPagePropertiesModelMethodsTest() {
    assertPojoMethodsForAll(PagePropertiesModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  void pageManagerNotNullTest(AemContext aemContext) {
    aemContext.load().json("/navigation/navigation.json", CONTENT_PATH);
    AppAemContextUtils.setResource(aemContext, "/content/tonomus/en-us");
    PagePropertiesModel pp = aemContext.request().adaptTo(PagePropertiesModel.class);
    assertNotNull(pp);
    pp.setDescription("description");
    pp.setTitle("title");
    pp.setNavTitle("navTitle");
    assertEquals("/content/tonomus/en-us.html", pp.getUrl());
    assertEquals("description", pp.getDescription());
    assertEquals("title", pp.getTitle());
    assertEquals("navTitle", pp.getNavTitle());
  }
}
