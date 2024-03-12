package com.tonomus.core.slingmodels.components.v1.interactive_overview;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class InteractiveOverviewModelTest {

  @Test
  @DisplayName("Test all getters")
  void getterAttributeInteractiveOverviewModelTest() {
    assertPojoMethodsForAll(InteractiveOverviewModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters")
  void getterAttributeInteractiveOverviewModelItemTest() {
    assertPojoMethodsForAll(InteractiveOverviewItemModel.class)
        .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(InteractiveOverviewContentModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }

}