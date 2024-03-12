package com.tonomus.core.slingmodels.components.v1.forms;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import pl.pojo.tester.api.assertion.Method;

public class FormCheckBoxModelTest {

    @Test
    @DisplayName("Test all getters")
    void getterSetterMethodsTest() {
        assertPojoMethodsForAll(FormCheckBoxModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }
}
