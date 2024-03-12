package com.tonomus.core.slingmodels.components.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class ErrorPageModelTest {
  @Test
  @DisplayName("Test all getters and setters of ErrorPage Model")
  void getterSetterErrorPageModelModelMethodsTest() {
    assertPojoMethodsForAll(ErrorPageModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }
}