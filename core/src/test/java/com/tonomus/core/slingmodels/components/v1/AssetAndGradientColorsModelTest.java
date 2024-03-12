package com.tonomus.core.slingmodels.components.v1;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class AssetAndGradientColorsModelTest {

    @Test
    @DisplayName("Test all getters and setters of HeroModel")
    void getterSetterWebGlEffectHeroModelMethodsTest() {
        assertPojoMethodsForAll(AssetAndGradientColorsModel.class)
                .testing(Method.GETTER).areWellImplemented();
    }

}