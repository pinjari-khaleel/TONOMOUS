package com.tonomus.core.slingmodels.components.v1.logos;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.pojo.tester.api.assertion.Method;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

public class LogosItemModelTest {

    @Test
    @DisplayName("Test all getters") void getterAttributeLogosItemModelTestTest() {
        assertPojoMethodsForAll(LogosItemModel.class).testing(Method.GETTER).areWellImplemented();
        assertPojoMethodsForAll(LogosItemModel.class).testing(Method.GETTER)
                .areWellImplemented();
    }
}
