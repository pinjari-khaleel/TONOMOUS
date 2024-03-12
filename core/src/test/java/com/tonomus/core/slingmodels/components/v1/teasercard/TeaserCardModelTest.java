package com.tonomus.core.slingmodels.components.v1.teasercard;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import pl.pojo.tester.api.assertion.Method;

public class TeaserCardModelTest {

    @Test
    @DisplayName("Test all getters")
    void getterAttributeCardsListModelTest() {
        assertPojoMethodsForAll(TeaserCardModel.class).testing(Method.GETTER).areWellImplemented();
    }
}
