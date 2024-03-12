package com.tonomus.core.slingmodels.components.v1;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class WebGlEffectHeroModelTest {

    private static final String CONTENT_PATH = "/content/neom/en-us/c79-test";

    @BeforeEach
    public void setUp(AemContext context) {
        context.load().json("/components/c79-webgl-effect-hero/c79-webgl-effect-hero.json", CONTENT_PATH);
    }

    @Test
    @DisplayName("Test all getters and setters of HeroModel")
    void getterSetterWebGlEffectHeroModelMethodsTest() {
        assertPojoMethodsForAll(WebGlEffectHeroModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }

    @Test
    void testWebGlEffectHeroModelModel(AemContext aemContext) {
        String RESOURCE_PATH = "/content/neom/en-us/c79-test/jcr:content/root/responsivegrid/c79_webgl_effect_her";

        Resource resource = aemContext.currentResource(RESOURCE_PATH);
        assertNotNull(resource);
        WebGlEffectHeroModel model = resource.adaptTo(WebGlEffectHeroModel.class);
        assertNotNull(model);
        assertNotNull(model.getLoopingVideo().getProps().getVideo().getSrc());
        assertNotNull(model.getOpenVideoButton());
        assertNotNull(model.getPlayButton().getVideo());
    }
}