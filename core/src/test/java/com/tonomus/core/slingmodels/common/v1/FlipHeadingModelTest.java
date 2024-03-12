package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class FlipHeadingModelTest {

    @Test
    @DisplayName("Test all getters")
    void getterAttributeCreatorModelTest() {
        assertPojoMethodsForAll(ModalModel.class)
                .testing(Method.GETTER).areWellImplemented();
    }

}