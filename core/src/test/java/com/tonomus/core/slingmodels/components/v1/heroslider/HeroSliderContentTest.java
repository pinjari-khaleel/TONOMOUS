package com.tonomus.core.slingmodels.components.v1.heroslider;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class HeroSliderContentTest {

  @Test void init(AemContext context) {
    final String contentPath = "/content/neom/en-us/trojena-form";
    context.load().json(
        "/components/c26-hero-slider/hero-slider.json",
        contentPath);
    HeroSliderItem heroSliderItem = context.currentResource(
            contentPath + "/jcr:content/root" + "/responsivegrid/c26_hero_banner")
        .adaptTo(HeroSliderItem.class);
    assertNotNull(heroSliderItem);
    assertNotNull(heroSliderItem.getContent());
  }

  @Test
  @DisplayName("Test all getters")
  void getterHeroSliderItemTest() {
    assertPojoMethodsForAll(HeroSliderItem.class)
        .testing(Method.GETTER).areWellImplemented();
  }
}
