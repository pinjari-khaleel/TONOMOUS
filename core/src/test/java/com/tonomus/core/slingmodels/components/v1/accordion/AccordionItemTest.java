package com.tonomus.core.slingmodels.components.v1.accordion;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class AccordionItemTest {

  @Test
  @DisplayName("Test all getters")
  void getterAttributeAccordionItemTest() {
    assertPojoMethodsForAll(AccordionItem.class)
        .testing(Method.GETTER).areWellImplemented();
  }
}