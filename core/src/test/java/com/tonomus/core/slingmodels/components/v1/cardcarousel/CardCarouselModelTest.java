package com.tonomus.core.slingmodels.components.v1.cardcarousel;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

/**
 * Unit test for CardCarouselModel class.
 */
class CardCarouselModelTest {

  @Test
  @DisplayName("Test all getters and constructor of the model")
  void wellImplementedTest() {
    assertPojoMethodsForAll(CardCarouselModel.class).testing(Method.CONSTRUCTOR, Method.GETTER)
        .areWellImplemented();
  }

}
