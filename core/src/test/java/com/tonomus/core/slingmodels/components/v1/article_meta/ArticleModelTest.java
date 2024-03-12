package com.tonomus.core.slingmodels.components.v1.article_meta;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class ArticleModelTest {

  @Test
  @DisplayName("Test all getters")
  void getterAttributeArticleModelTest() {
    assertPojoMethodsForAll(ArticleModel.class)
        .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ArticleMetaModel.class)
        .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ValueAndTextModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }
}