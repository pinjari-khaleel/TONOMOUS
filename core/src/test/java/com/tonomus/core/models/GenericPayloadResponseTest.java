package com.tonomus.core.models;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class GenericPayloadResponseTest {
  @Test
  void getterSetterTextModelTest() {
    assertPojoMethodsForAll(GenericPayloadResponse.class)
        .testing(Method.CONSTRUCTOR).areWellImplemented();
  }
}