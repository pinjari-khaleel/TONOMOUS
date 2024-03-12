package com.tonomus.core.slingmodels.components.v1.heroslider;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class HeroSliderModelTest {

    @Test
    @DisplayName("Test all getters and setters of HeroSliderModel")
    void getterSetterHeroSliderModelMethodsTest() {
        assertPojoMethodsForAll(HeroSliderModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }

    @Test
    @DisplayName("Test all getters and setters of HeroSliderItem")
    void getterSetterHeroItemMethodsTest() {
        assertPojoMethodsForAll(HeroSliderItem.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }

    @Test
    @DisplayName("Test all getters and setters of HeroSliderContent")
    void getterSetterHeroContentMethodsTest() {
        assertPojoMethodsForAll(HeroSliderContent.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }

    private static final String CONTENT_PATH = "/content/neom/en-us";

    @BeforeEach
    public void setUp(AemContext context) {
        context.load().json("/components/c12-hero-slider/c12-hero-slider.json", CONTENT_PATH);
    }

    @Test
    void testHeroModel(AemContext aemContext) {
        String RESOURCE_PATH = "/content/neom/en-us" + "/jcr:content/root/responsivegrid/c12_hero_slider";

        Resource resource = aemContext.currentResource(RESOURCE_PATH);
        assertNotNull(resource);
        HeroSliderModel heroSliderModelModel = resource.adaptTo(HeroSliderModel.class);
        assertNotNull(heroSliderModelModel);
        assertTrue(heroSliderModelModel.getItems().get(0).getBackground().getVideo().getProps().isAutoplay());
        assertTrue(heroSliderModelModel.getItems().get(0).getContent().getVideo().getProps().isAutoplay());
        List<ButtonModel> buttonModelList = heroSliderModelModel.getItems().get(0).getContent().getButtons();
        assertEquals("data-video-button", buttonModelList.get(0).getAttrs());
        assertNull(buttonModelList.get(1).getAttrs());
        assertFalse(buttonModelList.get(0).getVideo().getProps().isAutoplay());
    }
}