package com.tonomus.core.slingmodels.components.v1.forms;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class FormMessagesTest {

  @Test
  @DisplayName("Test all getters of FormMessages")
  void getterFormMessagesMethodsTest() {
    assertPojoMethodsForAll(FormMessages.class, FormMessages.FormMessage.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }
}
