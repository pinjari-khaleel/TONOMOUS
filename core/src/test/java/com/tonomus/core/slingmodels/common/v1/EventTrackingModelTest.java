package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class EventTrackingModelTest {

    @Test
    @DisplayName("Test all getters and setters of EventTrackingModel")
    void getterSetterTextModelTest() {
        assertPojoMethodsForAll(EventTrackingModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }
}