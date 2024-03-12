package com.tonomus.core.models.newsroom.lightbox;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class DataTest {


  @Test
  @DisplayName("Test all getters and setters of TextModel")
  void getterSetterTextModelTest() {
    assertPojoMethodsForAll(Data.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER, Method.SETTER).areWellImplemented();
  }

}