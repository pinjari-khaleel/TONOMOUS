package com.tonomus.core.slingmodels.components.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class TabbedCtaListModelTest {

  @Test
  @DisplayName("Test all getters")
  void getterAttributeFactsListModelTest() {
    assertPojoMethodsForAll(TabbedCtaListModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters")
  void getterAttributeFactsListModelItemTest() {
    assertPojoMethodsForAll(TabbedCtaListModel.Item.class)
        .testing(Method.GETTER).areWellImplemented();
  }

}