package com.tonomus.core.slingmodels.components.v1.cardslider;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class CardSliderModelTest {

  @Test @DisplayName("Test all getters") void getterAttributeCardsListModelTest() {
    assertPojoMethodsForAll(CardSliderModel.class).testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(CardSliderBaseCardModel.class).testing(Method.GETTER)
        .areWellImplemented();
    assertPojoMethodsForAll(CardSliderModal.class).testing(Method.GETTER).areWellImplemented();
  }

}