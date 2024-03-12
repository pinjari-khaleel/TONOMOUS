package com.tonomus.core.slingmodels.components.v1.logos;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.slingmodels.components.v1.WebGlEffectHeroModel;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class LogoMarqueeModelTest {

    private static final String CONTENT_PATH = "/content/neom/en-us/c85-logo-marquee";

    @BeforeEach
    public void setUp(AemContext context) {
        context.load().json("/components/c85-logo-marquee/c85-logo-marquee-page.json", CONTENT_PATH);
    }

    @Test
    @DisplayName("Test all getters and setters of HeroModel")
    void getterSetterLogoMarqueeModelMethodsTest() {
        assertPojoMethodsForAll(WebGlEffectHeroModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }

    @Test
    void testLogoMarqueeModel(AemContext aemContext) {
        String RESOURCE_PATH =
            "/content/neom/en-us/c85-logo-marquee/jcr:content/root/responsivegrid/c85_logo_marquee";

        Resource resource = aemContext.currentResource(RESOURCE_PATH);
        assertNotNull(resource);
        LogoMarqueeModel model = resource.adaptTo(LogoMarqueeModel.class);
        assertNotNull(model);
        assertNotNull(model.getHeading());
        assertNotNull(model.getHeading().getText());
        assertNotNull(model.getItems());
        assertEquals(4, model.getItems().size());
    }
}