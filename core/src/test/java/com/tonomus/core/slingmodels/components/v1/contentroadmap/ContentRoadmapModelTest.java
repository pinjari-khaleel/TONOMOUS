package com.tonomus.core.slingmodels.components.v1.contentroadmap;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class ContentRoadmapModelTest {
  @Test @DisplayName("Test all getters") void getterSetterPackageTest() {
    assertPojoMethodsForAll(ContentRoadmapModel.class, ContentRoadmapStepModel.class).testing(
        Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }
}
