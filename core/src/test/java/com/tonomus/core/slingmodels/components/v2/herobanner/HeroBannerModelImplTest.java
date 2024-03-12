package com.tonomus.core.slingmodels.components.v2.herobanner;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.tonomus.core.utils.AppAemContextUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class HeroBannerModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsForAll(HeroBannerModelImpl.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/herobanner/v2/herobanner/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + HeroBannerModelImpl.RESOURCE_TYPE);
    context.load().json("/components/herobanner/herobanner.json", CONTENT_PAGE);
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    HeroBannerModelImpl model = context.request().adaptTo(HeroBannerModelImpl.class);
    assertNotNull(model);
    assertNotNull(model.getTeaser());
    assertEquals(3, model.getDescriptions().size());
    assertEquals("Another Description", model.getDescriptions().get(2).getDescription());
  }

  @Test
  void testInterface() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    HeroBannerModel model = context.request().adaptTo(HeroBannerModel.class);
    assertNotNull(model);
    assertNotNull(model.getTeaser());
    assertEquals(3, model.getDescriptions().size());
    assertEquals("Another Description", model.getDescriptions().get(2).getDescription());
  }
}
