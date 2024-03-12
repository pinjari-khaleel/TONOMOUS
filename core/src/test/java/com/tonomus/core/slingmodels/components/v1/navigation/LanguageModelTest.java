package com.tonomus.core.slingmodels.components.v1.navigation;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class LanguageModelTest {

  @Test @DisplayName("Test all getters and constructor of LanguageModel")
  void getterLanguageModelMethodsTest() {
    assertPojoMethodsForAll(LanguageModel.class).testing(Method.CONSTRUCTOR, Method.GETTER)
        .areWellImplemented();
  }

  @Test @DisplayName("Test setter of LanguageModel")
  void setterLanguageModelTest() {
    LanguageModel lm = new LanguageModel();
    lm.setActive(true);
    assertTrue(lm.isActive());
  }
}