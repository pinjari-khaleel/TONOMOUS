package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class ArticleDataLayerModelTest {

  @Test
    @DisplayName("Test all getters and setters of ArticleDataLayerModel")
    void getterSetterTextModelTest() {
        assertPojoMethodsForAll(ArticleDataLayerModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }
}