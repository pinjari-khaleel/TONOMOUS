package com.tonomus.core.slingmodels.components.v1.map;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class MapModelTest {

    private static final String CONTENT_PATH = "/content/neom/en-us";

    @BeforeEach
    public void setUp(AemContext context) {
        context.load().json("/components/c19-map/c19-map.json", CONTENT_PATH);
    }

    @Test @DisplayName("Test all getters and constructor of LottieAnimationModel")
    void getterSetterLottieAnimationModelMethodsTest() {
        assertPojoMethodsForAll(LottieAnimationModel.class).testing(Method.CONSTRUCTOR, Method.GETTER)
                .areWellImplemented();
    }
}