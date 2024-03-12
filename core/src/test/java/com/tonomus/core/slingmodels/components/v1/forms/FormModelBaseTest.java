package com.tonomus.core.slingmodels.components.v1.forms;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class FormModelBaseTest {

  @Test
  @DisplayName("Test all getters of FormModelBase")
  void getterSetterMethodsTest() {
    assertPojoMethodsForAll(FormModelBase.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }
}