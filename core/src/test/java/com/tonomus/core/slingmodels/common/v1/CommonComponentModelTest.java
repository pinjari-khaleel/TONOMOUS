package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class CommonComponentModelTest {

    @Test
    @DisplayName("Test all getters and setters of CommonComponentModel")
    void getterSetterTextModelTest() {
        assertPojoMethodsForAll(CommonComponentModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }
}