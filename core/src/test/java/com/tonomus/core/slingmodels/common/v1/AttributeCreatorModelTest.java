package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class AttributeCreatorModelTest {

  @Test
  @DisplayName("Test all getters")
  void getterAttributeCreatorModelTest() {
    assertPojoMethodsForAll(AttributeCreatorModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test for constructor")
  void constructorTest() {
    AttributeCreatorModel acm1 = new AttributeCreatorModel("data-play-button");
    assertEquals(1, acm1.getAttributes().size());

    AttributeCreatorModel acm2 = new AttributeCreatorModel("");
    assertEquals(0, acm2.getAttributes().size());

    AttributeCreatorModel acm3 = new AttributeCreatorModel("data-play-button=available");
    assertEquals(1, acm3.getAttributes().size());

    AttributeCreatorModel acm4 = new AttributeCreatorModel("data=value1=value2");
    assertEquals(1, acm4.getAttributes().size());
  }
}