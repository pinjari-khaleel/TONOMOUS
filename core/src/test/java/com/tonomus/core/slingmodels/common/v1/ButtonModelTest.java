package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class ButtonModelTest {

    @Test
    @DisplayName("Test all getters")
    void getterAttributeCreatorModelTest() {
        assertPojoMethodsForAll(ButtonModel.class)
            .testing(Method.GETTER, Method.SETTER).areWellImplemented();
    }
}
