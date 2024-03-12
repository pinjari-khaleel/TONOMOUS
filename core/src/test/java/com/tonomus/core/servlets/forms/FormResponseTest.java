package com.tonomus.core.servlets.forms;

import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.models.newsroom.lightbox.Data;

import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class FormResponseTest {
  @Test
  void getterSetterTextModelTest() {
    assertPojoMethodsForAll(FormResponse.class)
        .testing(Method.CONSTRUCTOR).areWellImplemented();
  }
}