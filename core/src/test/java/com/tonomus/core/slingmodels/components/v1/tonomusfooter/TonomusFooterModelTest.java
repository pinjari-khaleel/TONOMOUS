package com.tonomus.core.slingmodels.components.v1.tonomusfooter;

import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.slingmodels.common.v1.LogoModel;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class TonomusFooterModelTest {

  @Test
  @DisplayName("Test all getters and setters of package")
  void getterSetterTonomusFooterTest() {
    assertPojoMethodsForAll(TonomusFooterModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(LogoModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }
}