package com.tonomus.core.slingmodels.components.v1;

import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.slingmodels.components.v1.forms.FieldsetLegendModel;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class FieldsetLegendModelTest {

  @Test
  @DisplayName("Test all getters of FieldsetLegendModelTest models")
  void getterSetterMethodsTest() {
    assertPojoMethodsForAll(FieldsetLegendModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

}
