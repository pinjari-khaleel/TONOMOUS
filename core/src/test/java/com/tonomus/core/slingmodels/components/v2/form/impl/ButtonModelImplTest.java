package com.tonomus.core.slingmodels.components.v2.form.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.tonomus.core.services.v2.TonomusRecaptchaConfigService;
import com.tonomus.core.slingmodels.components.v2.form.ButtonModel;
import com.tonomus.core.utils.AppAemContextUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

@ExtendWith(AemContextExtension.class)
class ButtonModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(ButtonModelImpl.class, FieldPredicate.exclude("tonomusRecaptchaConfigService"))
        .testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/form/container/v2/container/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + ButtonModelImpl.RESOURCE_TYPE);
    context.load().json("/components/form/form.json", CONTENT_PAGE);
    TonomusRecaptchaConfigService tonomusRecaptchaConfigService = mock(TonomusRecaptchaConfigService.class);
    context.registerService(TonomusRecaptchaConfigService.class, tonomusRecaptchaConfigService);

    when(tonomusRecaptchaConfigService.isNotEmpty()).thenReturn(true);
    when(tonomusRecaptchaConfigService.getSiteKey()).thenReturn("thisissitekey");
  }

  @Test
  void testGetModelImpl() {
    ButtonModelImpl model = context.resourceResolver().getResource(CONTENT_PAGE + "/jcr:content/root/container/button")
        .adaptTo(ButtonModelImpl.class);
    assertNotNull(model);
    assertTrue(model.isRecaptchaEnabled());
    assertEquals("thisissitekey", model.getRecaptchaSiteKey());
    assertTrue(model.isRecaptchaConfigured());
  }

  @Test
  void testInterface() {
    ButtonModel model = context.resourceResolver().getResource(CONTENT_PAGE + "/jcr:content/root/container/button-withRecaptcha")
        .adaptTo(ButtonModel.class);
    assertNotNull(model);
    assertFalse(model.isRecaptchaEnabled());
    assertNull(model.getRecaptchaSiteKey());
    assertTrue(model.isRecaptchaConfigured());
  }
}
