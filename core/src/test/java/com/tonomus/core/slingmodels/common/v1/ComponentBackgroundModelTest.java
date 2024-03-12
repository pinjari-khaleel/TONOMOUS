package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class ComponentBackgroundModelTest {

  @Test @DisplayName("Test all getters of ComponentBackgroundModel") void getterSetterMethodsTest() {
    assertPojoMethodsForAll(ComponentBackgroundModel.class).testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test @DisplayName("Test background checking method") void testHasBackgroundMethodsTest() {
    ComponentBackgroundModel backgroundModel = new ComponentBackgroundModel(null);
    assertFalse(backgroundModel.hasBackground());
  }

  @Test @DisplayName("Test default mask initialization not injected")
  void testMaskInitialization_whenNotInjected() {
    ComponentBackgroundModel backgroundModel = new ComponentBackgroundModel(null);
    assertEquals(ComponentBackgroundModel.Mask.DEFAULT_MASK, backgroundModel.getMask());
  }

  @Test @DisplayName("Test default mask initialization when injected")
  void testMaskInitialization_whenInjected() {
    ComponentBackgroundModel.Mask mask = mock(ComponentBackgroundModel.Mask.class);
    ComponentBackgroundModel backgroundModel = new ComponentBackgroundModel(mask);
    assertEquals(mask, backgroundModel.getMask());
  }
}