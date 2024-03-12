package com.tonomus.core.legacy.cloud;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class GoogleRecaptchaConfigurationTest {

  @Test
  @DisplayName("Test all getters")
  void getterGoogleRecaptchaConfiguration() {
    assertPojoMethodsForAll(GoogleRecaptchaConfiguration.class)
        .testing(Method.GETTER).areWellImplemented();
  }
}