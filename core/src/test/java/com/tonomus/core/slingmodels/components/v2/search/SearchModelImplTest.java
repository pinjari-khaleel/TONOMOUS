package com.tonomus.core.slingmodels.components.v2.search;

import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static com.tonomus.core.constants.Constants.DEFAULT_LOCALE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

@ExtendWith(AemContextExtension.class)
class SearchModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(SearchModelImpl.class, FieldPredicate.exclude("resource"))
        .testing(Method.GETTER).areWellImplemented();

    assertPojoMethodsFor(SearchModelImpl.KeywordModel.class).testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp(AemContext context) {
    context.load().json("/components/search/search.json", CONTENT_PAGE);
    context.addModelsForClasses(SearchModelImpl.class, SearchModel.class, SearchModelImpl.KeywordModel.class);

  }

  @Test
  void testGetModelImpl(AemContext context) {
    SearchModelImpl model = context.resourceResolver().getResource(CONTENT_PAGE + "/jcr:content/root/component")
        .adaptTo(SearchModelImpl.class);
    assertNotNull(model);
    assertEquals(DEFAULT_LOCALE, model.getAcceptLanguage());
    assertEquals(CONTENT_PAGE + "/_jcr_content/root/component", model.getActionPath());
  }
}
