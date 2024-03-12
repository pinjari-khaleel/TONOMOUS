package com.tonomus.core.slingmodels.components.v1.cardlist;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class CardListModelTest {

  @Test
  @DisplayName("Test all getters")
  void getterAttributeCardsListModelTest() {
    assertPojoMethodsForAll(CardListModel.class)
        .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(CardContentModel.class)
        .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(CardItemModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }

}