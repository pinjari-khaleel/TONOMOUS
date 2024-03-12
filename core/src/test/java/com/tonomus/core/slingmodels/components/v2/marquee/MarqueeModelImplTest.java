package com.tonomus.core.slingmodels.components.v2.marquee;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(AemContextExtension.class)
public class MarqueeModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  @BeforeEach
  void setUp(AemContext context) {
    context.load().json("/components/marquee/marquee.json", CONTENT_PAGE);
  }

  @Test
  void testGetModelImpl(AemContext context) {
    MarqueeModelImpl model = context.resourceResolver().getResource(CONTENT_PAGE + "/jcr:content/root/component")
        .adaptTo(MarqueeModelImpl.class);
    assertNotNull(model);
    assertEquals(2, model.getImages().size());
  }

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(MarqueeModelImpl.class)
        .testing(Method.GETTER).areWellImplemented();
  }

}
