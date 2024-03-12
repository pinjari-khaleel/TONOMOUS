package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class HeaderModelTest {

    @Test
    @DisplayName("Test all getters and setters of HeaderModel")
    void getterSetterTextModelTest() {
        assertPojoMethodsForAll(HeaderModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }
}