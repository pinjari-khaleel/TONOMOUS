package com.tonomus.core.slingmodels.components.v1.carousel;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class CarouselModelTest {

  private static final String CONTENT_PATH = "/content/tonomus/en/c16-carousel";

  @BeforeEach
  public void setUp(AemContext context) {
    context.load().json("/components/c16-carousel/c16-carousel.json", CONTENT_PATH);
  }

  @Test
  void testCarouselModel(AemContext aemContext) {
    String RESOURCE_PATH = "/content/tonomus/en/c16-carousel/jcr:content/root/responsivegrid/c16_carousel";

    CarouselModel carouselModel = aemContext.currentResource(RESOURCE_PATH).adaptTo(CarouselModel.class);
    assertNotNull(carouselModel.getItems());
    assertTrue(carouselModel.getItems().get(0).getVideo().getProps().isAutoplay());
  }

  @Test
  @DisplayName("Test all getters")
  void getterModelTest() {
    assertPojoMethodsForAll(CarouselModel.class).testing(Method.GETTER).areWellImplemented();
  }

  @Test
  void testCarouselModelInitConditions(AemContext aemContext) {
    String RESOURCE_PATH = "/content/tonomus/en/c16-carousel/jcr:content/root/responsivegrid/c16_carousel-initConditions";
    CarouselModel carouselModel = aemContext.currentResource(RESOURCE_PATH).adaptTo(CarouselModel.class);
    assertNotNull(carouselModel.getItems());
    assertEquals("Some Title",carouselModel.getItems().get(0).getImage().getAlt());
  }
}
