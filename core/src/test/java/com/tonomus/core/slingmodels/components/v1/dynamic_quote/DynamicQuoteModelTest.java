package com.tonomus.core.slingmodels.components.v1.dynamic_quote;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class DynamicQuoteModelTest {
  @Test
  @DisplayName("Test all getters")
  void getterAttributeCardsListModelTest() {
    assertPojoMethodsForAll(DynamicQuoteModel.class)
        .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(QuoteItemModel.class)
        .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(QuoteModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }
}