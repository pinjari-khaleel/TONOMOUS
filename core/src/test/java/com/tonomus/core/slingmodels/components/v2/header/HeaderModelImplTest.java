package com.tonomus.core.slingmodels.components.v2.header;

import pl.pojo.tester.api.assertion.Method;

import org.apache.sling.servlethelpers.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.day.cq.wcm.api.Page;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class HeaderModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";
  private MockSlingHttpServletRequest request;

  @Test
  void getterAttributeTonomusNavigationModelTest() {
    assertPojoMethodsForAll(HeaderModelImpl.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp(AemContext context) {
    context.load().json("/components/header/header.json", CONTENT_PAGE);
    Page page = context.resourceResolver().getResource(CONTENT_PAGE).adaptTo(Page.class);
    context.currentPage(page);
    request = context.request();
  }

  @Test
  void testInit(AemContext context) {
    request.setResource(
        context.resourceResolver().getResource(CONTENT_PAGE + "/jcr:content/root/component"));
    HeaderModelImpl model = request.adaptTo(HeaderModelImpl.class);
    assertNotNull(model);
    assertEquals(2, model.getLanguageNavigation().size());
  }

  @Test
  void testWithoutLanguages(AemContext context) {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component-without-langauges");
    HeaderModelImpl model = request.adaptTo(HeaderModelImpl.class);
    assertNotNull(model);
    assertNull(model.getLanguageNavigation());
  }
}
