package com.tonomus.core.slingmodels.components.v1.navigation;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import pl.pojo.tester.api.assertion.Method;

public class BusinessUnitModelTest {

  @Test
  @DisplayName("Test all getters of Business Unit")
  void getterBusinessUnitModelMethodsTest() {
    assertPojoMethodsForAll(BusinessUnitModel.class).testing(Method.GETTER)
        .areWellImplemented();
  }
}
