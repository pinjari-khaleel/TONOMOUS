package com.tonomus.core.slingmodels.components.v1.tonomus_navigation;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class TonomusNavigationModelTest {

  @Test
  @DisplayName("Test all getters")
  void getterAttributeTonomusNavigationModelTest() {
    assertPojoMethodsForAll(TonomusNavigationModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }
}
