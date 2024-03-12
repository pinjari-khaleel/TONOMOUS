package com.tonomus.core.slingmodels.components.v1.bu_cards;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class BUCardsModelTest {

  @Test @DisplayName("Test all getters") void getterAttributeCardsListModelTest() {
    assertPojoMethodsForAll(BUCardsModel.class).testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(BUCardItemModel.class).testing(Method.GETTER)
        .areWellImplemented();
  }

}