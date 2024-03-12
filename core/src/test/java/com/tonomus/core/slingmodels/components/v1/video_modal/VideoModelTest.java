package com.tonomus.core.slingmodels.components.v1.video_modal;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class VideoModelTest {

  @Test @DisplayName("Test all getters") void getterAttributeCardsListModelTest() {
    assertPojoMethodsForAll(VideoModalModel.class).testing(Method.GETTER).areWellImplemented();
  }

}